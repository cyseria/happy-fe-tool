/**
 * @file happy add commitizen -t baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const path = require('path');
const inquirer = require('inquirer');

const {getConfigSourcePath, getConfigTargetPath} = require('../utils/config-opts');

// name - config file name
const adapterConfigFile = {
    'cz-customizable': '.cz-config.js'
};

/**
 * 安装 commitizen, 和对应规则
 * @param {{name: string, content: string|Object}} rule - 规则相关的配置
 * @param {string} tplName - 使用的模板名称, eg. baidu
 * @param {string} dir - 配置写入的路径
 */
module.exports = async (rule, tplName, dir) => {
    const copyOpts = [];
    let pkgOpts = {install: [], edit: []};

    // get cli's adapter, if commitizen config is error, let user choose
    const userInput = await inquirer.prompt([
        {
            type: 'list',
            name: 'adapter',
            message: 'choose a adapters for commitizen: ',
            choices: Object.keys(adapterConfigFile),
            when() {
                return !rule.content || !Object.keys(adapterConfigFile).includes(rule.content);
            }
        }
    ]);
    const adapter = userInput.adapter || rule.content;

    // install basic cz
    // eslint-disable-next-line
    const cliOpt = await getCliConfig(tplName, dir, adapter);
    copyOpts.push(cliOpt.copyOpt);
    pkgOpts.install = [...pkgOpts.install, ...cliOpt.pkgOpt.install];
    pkgOpts.edit = [...pkgOpts.edit, ...cliOpt.pkgOpt.edit];

    // install adapter
    pkgOpts.install.push(adapter);
    // eslint-disable-next-line
    const adapterOpt = await getAdapterConfig(tplName, dir, adapter);
    copyOpts.push(adapterOpt.copyOpt);
    pkgOpts.install = [...pkgOpts.install, ...adapterOpt.pkgOpt.install];
    pkgOpts.edit = [...pkgOpts.edit, ...adapterOpt.pkgOpt.edit];

    // add `npm run commit` in pkg
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
    const cliConfigFileName = '.czrc';
    pkgOpt.install.push('commitizen');

    if (!!customConfigDir) {
        pkgOpt.edit.push({
            path: ['config', 'commitizen', 'path'],
            content: `./node_modules/${adapter}`
        });
    }
    else {
        copyOpt.sourcePath = await getConfigSourcePath('.czrc', tplName, cliConfigFileName);
        copyOpt.targetPath = getConfigTargetPath(copyOpt.sourcePath);
    }

    return {pkgOpt, copyOpt};
}

/**
 * get cz adapter's config
 * @param {string} tplName
 * @param {string} customConfigDir
 * @param {string} adapter
 * if user set custom config path, set config to custom config
 * otherwise, copy config to root dir
 */
async function getAdapterConfig(tplName, customConfigDir, adapter) {
    const copyOpt = {};
    const pkgOpt = {install: [], edit: []};

    const fileName = adapterConfigFile[adapter];
    copyOpt.sourcePath = await getConfigSourcePath(fileName, tplName, adapterConfigFile);

    if (!!customConfigDir) {
        copyOpt.targetPath = path.resolve(customConfigDir, fileName);

        const relativePath = path.relative(process.cwd(), customConfigDir);
        pkgOpt.edit.push({
            path: ['config', adapter, 'config'],
            content: relativePath ? path.join(relativePath, fileName) : ''
        });
    }
    else {
        copyOpt.targetPath = getConfigTargetPath(copyOpt.sourcePath);
    }

    return {pkgOpt, copyOpt};
}
