/**
 * @file happy add codelint -t baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const {
    getConfigSourcePath,
    getConfigTargetPath,
    installHusky,
    getConfigValue
} = require('../utils/config-opts');

// lint tool config
const supportConfigFile = {
    // fecs 的配置放在 package.json 不能以 path 的形式
    fecs: {
        supportConnfigFile: ['.fecsrc'],
        scriptsVal: 'fecs format --replace true && fecs check --level 2',
        configKeys: ['fecs'], // 放进 package.json 文件时的配置
        configType: 'file' // file 读取内容，path 传路径
    },

    eslint: {}
};

// lint-staged config: https://github.com/okonet/lint-staged#configuration
const supportLintConfigFile = ['.lintstagedrc', 'lint-staged.config.js'];

/**
 * 安装 codelint 检查用户的代码
 * 如果存在 hooks 字段, 配合 husky 和 lint-staged 来构建代码检查工作流
 * @param {{name: string, content: string|Object}} toolConfig - 规则相关的配置
 * @param {string} tplName - 使用的模板名称
 * @param @param {{configDir: string|undefined, moyuycHusky: boolean}} opts - 其他配置
 *
 * @example
 * toolConfig = {
 *   name: 'codelint',
 *   content: {
        lintTool: 'fecs',
        lintConfigFile: '.fecsrc',
        lintStagedConfigFile: '.lintstagedrc',
        hooks: 'pre-commit'
    }
 * }
 */
module.exports = async (toolConfig, tplName, opts) => {
    const copyOpts = [];
    let pkgOpts = {install: [], edit: []};

    const lintTool = toolConfig.content.lintTool || toolConfig.content;
    const {scriptsVal} = supportConfigFile[lintTool];

    // install lint tools, like fecs, and copy config file
    pkgOpts.install.push(lintTool);
    pkgOpts.edit.push({
        path: ['scripts', 'lint'],
        content: scriptsVal
    });

    const lintOpt = await getLintConfig(toolConfig, tplName, opts);
    copyOpts.push(lintOpt.copyOpt);
    pkgOpts.install = [...pkgOpts.install, ...lintOpt.pkgOpt.install];
    pkgOpts.edit = [...pkgOpts.edit, ...lintOpt.pkgOpt.edit];

    // install husky if set hooks config
    if (!!toolConfig.content.hooks) {
        const hookOpt = await getHookConfig(toolConfig.content, tplName, opts);
        copyOpts.push(hookOpt.copyOpt);
        pkgOpts.install = [...pkgOpts.install, ...hookOpt.pkgOpt.install];
        pkgOpts.edit = [...pkgOpts.edit, ...hookOpt.pkgOpt.edit];
    }

    return {copyOpts, pkgOpts};
};

// 获取默认配置信息
async function getLintConfig(toolConfig, tplName, opts) {
    const copyOpt = {};
    const pkgOpt = {install: [], edit: []};

    const lintTool = toolConfig.content.lintTool || toolConfig.content;
    const lintConfigFile = toolConfig.content.lintConfigFile || '';
    const {
        supportConnfigFile,
        configKeys,
        configType
    } = supportConfigFile[lintTool];

    const sourcePath = await getConfigSourcePath(lintConfigFile, tplName, supportConnfigFile);

    if (!!opts.configDir) {
        pkgOpt.edit.push({
            path: configKeys,
            content: await getConfigValue(configType, sourcePath, opts.configDir)
        });
    }
    else {
        copyOpt.sourcePath = sourcePath;
        copyOpt.targetPath = getConfigTargetPath(copyOpt.sourcePath);
    }

    return {pkgOpt, copyOpt};
}

// 如果使用了 hooks，安装 husky 等
async function getHookConfig(toolContent, tplName, opts) {
    const {hooks, lintStagedConfigFile} = toolContent;
    // install and set husky config
    let hooksConfig = {};
    if (!!hooks && typeof hooks === 'string') {
        hooksConfig[hooks] = 'lint-staged';
    }
    else {
        hooksConfig = hooks;
    }
    const huskyOpts = installHusky(hooksConfig, opts.moyuycHusky || '');
    const pkgOpt = {
        install: huskyOpts.install,
        edit: huskyOpts.edit
    };

    pkgOpt.install.push('lint-staged');

    // set lint stage config
    const sourcePath = await getConfigSourcePath(lintStagedConfigFile, tplName, supportLintConfigFile);
    const copyOpt = {};
    if (!!opts.configDir) {
        pkgOpt.edit.push({
            path: ['lint-staged'],
            content: await getConfigValue('file', sourcePath, opts.configDir)
        });
    }
    else {
        copyOpt.sourcePath = sourcePath;
        copyOpt.targetPath = getConfigTargetPath(copyOpt.sourcePath);
    }

    return {pkgOpt, copyOpt};
}
