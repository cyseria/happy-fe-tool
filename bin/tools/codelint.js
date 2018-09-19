/**
 * @file happy add codelint baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs-extra')
const path = require('path');
const copyFile = require('../utils/copy');
const {
    installPkg,
    editPkg
} = require('../utils/pkg');
const {getConfigFilePath, getConfigTargetPath, setConfig} = require('../utils/configOpt');

// lint tool config
const supportConfigFile = {
    // fecs 的配置放在 package.json 不能以 path 的形式
    fecs: {
        supportFile: ['.fecsrc'],
        scriptsVal: 'fecs format --replace true && fecs check --level 2',
        // 放进 package.json 文件时的配置
        configKeys: ['fecs'],
        configType: 'file' // file 读取内容，path 传路径
    },
    
    eslint: []
};

// lint-staged config: https://github.com/okonet/lint-staged#configuration
const supportLintConfigFile = ['.lintstagedrc', 'lint-staged.config.js'];

/**
 * 安装 codelint 检查用户的代码
 * 如果存在 hooks 字段, 配合 husky 和 lint-staged 来构建代码检查工作流
 * @param {{name: string, content: string|Object}} rule - 规则相关的配置
 * @param {string}} tplName - 使用的模板名称
 *
 * @example
 * rule = {
 *   name: 'codelint',
 *   content: {
        lintTool: 'fecs',
        lintConfigFile: '.fecsrc',
        lintStagedConfigFile: '.lintstagedrc',
        hooks: 'pre-commit'
    }
 * }
 */
module.exports = async (rule, tplName, dir) => {
    const lintTool = rule.content.lintTool || rule.content;
    const {supportFile, scriptsVal, configKeys, configType} = supportConfigFile[lintTool]

    // install lint tools, like fecs, and copy config file
    installPkg(lintTool);
    const lintConfigFile = rule.content.lintConfigFile || '';
    const sourcePath = await getConfigFilePath(lintConfigFile, tplName, supportFile);
    // const targetPath = getConfigTargetPath(sourcePath);
    // await copyFile(sourcePath, targetPath);


    const configVal = await getCOnfigValue(configType, sourcePath, dir);
    
    // set lint tool config file
    await setConfig(sourcePath, dir, {
        keys: configKeys,
        value: configVal,
        isCopyFile: false
    });

    editPkg(['scripts', 'lint'], scriptsVal);

    // baidu, 存在 commit-msg, husky 会自动忽略, 使用临时解决方案
    // if (tplName === 'baidu' && rule.content.hooks === 'commit-msg') {
    //     // TODO: if hooks === commit-msg, use personal package
    // }

    if (!!rule.content.hooks) {
        installPkg(['husky@next', 'lint-staged']);
        // lint-staged config file
        const lintStagedConfigFile = rule.content.lintStagedConfigFile || '';
        const sourcePath = await getConfigFilePath(lintStagedConfigFile, tplName, supportLintConfigFile);

        const configVal = await getCOnfigValue('file', sourcePath, dir);
        await setConfig(sourcePath, dir, {
            keys: ['lint-staged'],
            value: configVal,
            isCopyFile: false
        });

        // const targetPath = getConfigTargetPath(sourcePath);
        // await copyFile(sourcePath, targetPath);
        editPkg(['husky', 'hooks', rule.content.hooks], 'lint-staged');
    }

};

async function getCOnfigValue(configType, sourcePath, dir) {
    if (configType === 'file') {
        const sourceJson = await fs.readJson(sourcePath);
        return sourceJson;
    } else if (configType === 'path') {
        const relativePath = !!dir ? path.relative(process.cwd(), dir) : dir;
        const fileName = path.basename(adapterSourcePath);
        return relativePath ? path.join(relativePath, fileName) : '';
    }
}
