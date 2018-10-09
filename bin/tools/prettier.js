/**
 * @file happy add prettier -t baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const {
    getConfigSourcePath,
    getConfigTargetPath,
    getConfigValue
} = require('../utils/config-opts');

// confugyration file, see https://prettier.io/docs/en/configuration.html
const supportConfFile = [
    '.prettierrc',
    '.prettierrc.yaml',
    '.prettierrc.yml',
    '.prettierrc.json',
    '.prettierrc.toml',
    '.prettierrc.js',
    'prettier.config.js'
];

/**
 * 初始化 prettier
 * @param {{name: string, content: string|Object}} toolConfig - 规则相关的配置
 * @param {string}} tplName - 使用的模板名称
 * @param {{configDir: string|undefined, moyuycHusky: boolean}} opts - 其他配置
 *
 * @returns {{copyOpts, pkgOpts}}
 */
module.exports = async (toolConfig, tplName, opts = {}) => {
    const copyOpt = {};
    const pkgOpts = {install: [], edit: []};

    const sourcePath = await getConfigSourcePath(toolConfig, tplName, supportConfFile);

    const {configDir} = opts;
    // TODO：写进 package 里只支持 json 文件格式，需要考虑转换
    if (!!configDir) {
        pkgOpts.edit.push({
            path: ['prettier'],
            content: await getConfigValue('file', sourcePath)
        });
    }
    else {
        copyOpt.sourcePath = sourcePath;
        copyOpt.targetPath = getConfigTargetPath(copyOpt.sourcePath);
    }
    return {
        copyOpts: [copyOpt],
        pkgOpts
    };
};
