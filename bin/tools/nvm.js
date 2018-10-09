/**
 * @file Node Version Manager, see https://github.com/creationix/nvm
 * happy add nvm -t baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

/**
 * 初始化 nvm
 * @param {{name: 'nvm', content: string}} toolConfig - 规则相关的配置
 *
 * @example {name: 'nvm', content: 'v8.10.1'}
 */
module.exports = toolConfig => {
    const copyOpt = {};
    // if no config, use current node version
    if (!!toolConfig.content) {
        copyOpt.content = toolConfig.content;
    }
    else {
        copyOpt.content = process.version;
    }
    copyOpt.filename = '.nvmrc';
    return {
        copyOpts: [copyOpt]
    };
};
