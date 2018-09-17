/**
 * @file happy add commitizen baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const inquirer = require('inquirer');
const {installPkg, editPkg} = require('../utils/pkg');
const copyFile = require('../utils/copy');
const {getConfigFilePath, getConfigTargetPath} = require('../utils/configOpt');

const cliConfigFile = '.czrc';
const adapterConfigFile = {
    'cz-customizable': '.cz-config.js'
};

/**
 * 安装 commitizen, 和对应规则
 * @param {{name: string, content: string|Object}} rule - 规则相关的配置
 * @param {string}} tplName - 使用的模板名称
 */
module.exports = async (rule, tplName) => {
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

    // install commitizen, adapter and copy there config to root dir
    await installPkg('commitizen');
    // eslint-disable-next-line
    const cliSourcePath = await getConfigFilePath('.czrc', tplName, cliConfigFile);
    await copyFile(cliSourcePath, getConfigTargetPath(cliSourcePath));

    await installPkg(adapter);
    // eslint-disable-next-line
    const adapterSourcePath = await getConfigFilePath(adapterConfigFile[adapter], tplName, adapterConfigFile);

    await copyFile(adapterSourcePath, getConfigTargetPath(adapterSourcePath));

    // add `npm run commit` in pkg
    editPkg(['scripts', 'commit'], 'git-cz');

    // "path": "./node_modules/cz-conventional-changelog"
};
