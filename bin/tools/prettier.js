/**
 * @file prettier.js, cmd: happy add prettier -t baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const {getConfigFilePath, getConfigTargetPath} = require('../utils/configOpt');
const copyFile = require('../utils/copy');

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
    const sourcePath = await getConfigFilePath(rule, tplName, supportConfFile);
    const targetPath = getConfigTargetPath(sourcePath);
    await copyFile(sourcePath, targetPath);
};
