/**
 * @file happy add codelint -t baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const {
    getConfigSourcePath,
    getConfigTargetPath,
    getHuskyConfig,
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
 * @param {{name: string, content: string|Object}} rule - 规则相关的配置
 * @param {string} tplName - 使用的模板名称
 * @param {string} dir - 自定义配置路径
 *
 * @example
 * rule = {
 *   name: 'codelint',
 *   content: {
        lintTool: 'fecs',
        lintConfigFile: '.fecsrc',
        lintStagedConfigFile: '.lintstagedrc',
        hooks: 'pre-commit',
        moyuycHusky: true
    }
 * }
 */
module.exports = async (rule, tplName, dir) => {
    const copyOpts = [];
    let pkgOpts = {install: [], edit: []};

    const lintTool = rule.content.lintTool || rule.content;
    const {scriptsVal} = supportConfigFile[lintTool];

    // install lint tools, like fecs, and copy config file
    pkgOpts.install.push(lintTool);
    pkgOpts.edit.push({
        path: ['scripts', 'lint'],
        content: scriptsVal
    });

    const lintOpt = await getLintConfig(rule, tplName, dir);
    copyOpts.push(lintOpt.copyOpt);
    pkgOpts.install = [...pkgOpts.install, ...lintOpt.pkgOpt.install];
    pkgOpts.edit = [...pkgOpts.edit, ...lintOpt.pkgOpt.edit];

    // install husky if set hooks config
    if (!!rule.content.hooks) {
        const hookOpt = await getHookConfig(rule, tplName, dir);
        copyOpts.push(hookOpt.copyOpt);
        pkgOpts.install = [...pkgOpts.install, ...hookOpt.pkgOpt.install];
        pkgOpts.edit = [...pkgOpts.edit, ...hookOpt.pkgOpt.edit];
    }

    return {copyOpts, pkgOpts};
};

// 获取默认配置信息
async function getLintConfig(rule, tplName, customConfigDir) {
    const copyOpt = {};
    const pkgOpt = {install: [], edit: []};

    const lintTool = rule.content.lintTool || rule.content;
    const lintConfigFile = rule.content.lintConfigFile || '';
    const {
        supportConnfigFile,
        configKeys,
        configType
    } = supportConfigFile[lintTool];

    const sourcePath = await getConfigSourcePath(lintConfigFile, tplName, supportConnfigFile);

    if (!!customConfigDir) {
        pkgOpt.edit.push({
            path: configKeys,
            content: await getConfigValue(configType, sourcePath, customConfigDir)
        });
    }
    else {
        copyOpt.sourcePath = sourcePath;
        copyOpt.targetPath = getConfigTargetPath(copyOpt.sourcePath);
    }

    return {pkgOpt, copyOpt};
}

// 如果使用了 hooks，安装 husky 等
async function getHookConfig(rule, tplName, customConfigDir) {
    // install and set husky config
    const copyOpt = {};
    const husky = getHuskyConfig(rule.content.moyuycHusky || '');
    const pkgOpt = {
        install: husky.install,
        edit: husky.edit
    };

    pkgOpt.install.push('lint-staged');
    pkgOpt.edit.push({
        path: ['husky', 'hooks', rule.content.hooks],
        content: 'lint-staged'
    });

    // set lint stage config
    const lintStagedConfigFile = rule.content.lintStagedConfigFile || '';
    const sourcePath = await getConfigSourcePath(lintStagedConfigFile, tplName, supportLintConfigFile);

    if (!!customConfigDir) {
        pkgOpt.edit.push({
            path: ['lint-staged'],
            content: await getConfigValue('file', sourcePath, customConfigDir)
        });
    }
    else {
        copyOpt.sourcePath = sourcePath;
        copyOpt.targetPath = getConfigTargetPath(copyOpt.sourcePath);
    }

    return {pkgOpt, copyOpt};
}
