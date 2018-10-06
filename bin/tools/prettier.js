/**
 * @file happy add prettier -t baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const {getConfigSourcePath, getConfigTargetPath} = require('../utils/config-opts');

// confugyration file, see https://prettier.io/docs/en/configuration.html
const supportConfFile = [
    '.prettierrc.yaml',
    '.prettierrc.yml',
    '.prettierrc.json',
    '.prettierrc.toml',
    'prettier.config.js',
    '.prettierrc.js'
];

/**
 * 初始化 prettier
 * @param {{name: string, content: string|Object}} rule - 规则相关的配置
 * @param {string}} tplName - 使用的模板名称
 */
module.exports = async (rule, tplName) => {
    const copyOpt = {};
    copyOpt.sourcePath = await getConfigSourcePath(rule, tplName, supportConfFile);
    copyOpt.targetPath = getConfigTargetPath(copyOpt.sourcePath);
    return {
        copyOpts: [copyOpt]
    };
};
