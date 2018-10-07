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
 * @param {{name: string, content: string|Object}} rule - 规则相关的配置
 * @param {string}} tplName - 使用的模板名称
 * @param {string} dir - 自定义配置路径
 */
module.exports = async (rule, tplName, dir) => {
    const copyOpt = {};
    const pkgOpts = {install: [], edit: []};

    const sourcePath = await getConfigSourcePath(rule, tplName, supportConfFile);

    // TODO：写进 package 里只支持 json 文件格式，需要考虑转换
    if (!!dir) {
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
