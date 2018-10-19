/**
 * @file happy add commitizen -t baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const path = require('path');
const {getConfigSourcePath, getConfigTargetPath} = require('../utils/config-opts');

/**
 * example config
 commitizen: true
 commitizen: {
    adapter: 'cz-customizable',
    config: {isDesc: true, xxx}
 }
 */

// name - config file name
const adapterConfigFile = {
    'cz-customizable': '.cz-config.js'
};

/**
 * 安装 commitizen, 和对应规则
 * @param {{name: string, content: string|Object}} toolConfig - 规则相关的配置
 * @param {string} tplName - 使用的模板名称, eg. baidu
 * @param {{configDir: string|undefined, moyuycHusky: boolean}} opts - 其他配置
 *
 * @returns {{copyOpts, pkgOpts}}
 */
module.exports = async (toolConfig, tplName, opts) => {
    const copyOpts = [];
    let pkgOpts = {install: [], edit: []};

    const {content} = toolConfig;
    const adapter = content === true ? null : content.adapter;

    /* install basic cz */
    // eslint-disable-next-line
    const cliOpt = await getCliConfig(tplName, opts.configDir, adapter);
    copyOpts.push(cliOpt.copyOpt);
    pkgOpts.install = [...pkgOpts.install, ...cliOpt.pkgOpt.install];
    pkgOpts.edit = [...pkgOpts.edit, ...cliOpt.pkgOpt.edit];

    /* install adapter */
    if (!!adapter) {
        // eslint-disable-next-line
        const adapterOpt = await getAdapterConfig(tplName, opts.configDir, content);
        copyOpts.push(adapterOpt.copyOpt);
        pkgOpts.install = [...pkgOpts.install, ...adapterOpt.pkgOpt.install];
        pkgOpts.edit = [...pkgOpts.edit, ...adapterOpt.pkgOpt.edit];
    }

    /* add `npm run commit` in pkg */
    pkgOpts.edit.push({
        path: ['scripts', 'commit'],
        content: 'git-cz'
    });

    return {copyOpts, pkgOpts};
};

/**
 * get cz-cli's config
 * @param {string} tplName
 * @param {string} customConfigDir
 * cz-cli's config file do not support custom path
 * so if use custom, we set config into package.json
 */
async function getCliConfig(tplName, customConfigDir, adapter) {
    const copyOpt = {};
    const pkgOpt = {install: [], edit: []};
    pkgOpt.install.push('commitizen');

    pkgOpt.edit.push({
        path: ['config', 'commitizen', 'path'],
        content: `./node_modules/${adapter}`
    });
    return {pkgOpt, copyOpt};
}

/**
 * get cz adapter's config
 * @param {string} tplName
 * @param {string} customConfigDir
 * @param {Object} content
 * if user set custom config path, set config to custom config
 * otherwise, copy config to root dir
 */
async function getAdapterConfig(tplName, customConfigDir, content) {
    const copyOpt = {};
    const pkgOpt = {install: [], edit: []};
    const {
        adapter,
        registry,
        config,
        configFile
    } = content;

    pkgOpt.install.push({
        moduleName: adapter,
        config: {
            registry: registry || ''
        }
    });

    // 文件类型的配置
    if (!!configFile) {
        const fileName = configFile;
        copyOpt.sourcePath = await getConfigSourcePath(fileName, tplName, adapterConfigFile[adapter]);
        if (!!customConfigDir) {
            copyOpt.targetPath = path.resolve(customConfigDir, fileName);

            const relativePath = path.relative(process.cwd(), customConfigDir);
            pkgOpt.edit.push({
                path: ['config', adapter, 'config'], // 这里 cz-customizable 用的 config 字段，其他用的啥有待确认
                content: relativePath ? path.join(relativePath, fileName) : ''
            });
        }
        else {
            copyOpt.targetPath = getConfigTargetPath(copyOpt.sourcePath);
        }
    }

    // 在 package 里面修改的配置
    if (!!config) {
        pkgOpt.edit = Object.keys(config).map(key => {
            return {
                path: ['config', adapter, key],
                content: config[key]
            };
        });
    }

    return {pkgOpt, copyOpt};
}
