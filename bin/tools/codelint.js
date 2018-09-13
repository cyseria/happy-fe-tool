/**
 * @file happy add codelint baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const copyFile = require('../utils/copy');
const {
    installPkg,
    editPkg,
    addHooks
} = require('../utils/pkg');
const {getConfigFilePath, getConfigTargetPath} = require('../utils/configOpt');

// lint tool config
const supportConfigFile = {
    fecs: ['.fecsrc'],
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
module.exports = async (rule, tplName) => {
    const lintTool = rule.content.lintTool || rule.content;
    const supportFile = supportConfigFile[lintTool];

    installPkg(lintTool);

    const lintConfigFile = rule.content.lintConfigFile || '';
    const sourcePath = await getConfigFilePath(lintConfigFile, tplName, supportFile);
    const targetPath = getConfigTargetPath(sourcePath);
    await copyFile(sourcePath, targetPath);

    editPkg('scripts', 'fecs', 'fecs format --replace true && fecs check --level 2');

    // baidu, 存在 commit-msg, husky 会自动忽略, 使用临时解决方案
    // if (tplName === 'baidu' && rule.content.hooks === 'commit-msg') {
    //     // TODO: if hooks === commit-msg, use personal package
    // }
    if (!!rule.content.hooks) {
        installPkg(['husky@next', 'lint-staged']);

        const lintStagedConfigFile = rule.content.lintStagedConfigFile || '';
        const sourcePath = await getConfigFilePath(lintStagedConfigFile, tplName, supportLintConfigFile);
        const targetPath = getConfigTargetPath(sourcePath);
        await copyFile(sourcePath, targetPath);
        addHooks(rule.content.hooks, 'lint-staged');
    }

};
