/**
 * @file Node Version Manager, see https://github.com/creationix/nvm
 * happy add nvm -t baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

/**
 * 初始化 nvm
 * @param {{name: string, content: string|Object}} rule - 规则相关的配置
 * @param {string}} tplName - 使用的模板名称
 */
module.exports = rule => {
    const copyOpt = {};
    // if no config, use current node version
    if (!!rule.content) {
        copyOpt.content = rule.content;
    }
    else {
        copyOpt.content = process.version;
    }
    copyOpt.filename = '.nvmrc';
    return {
        copyOpts: [copyOpt]
    };
};
