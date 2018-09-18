/**
 * @file happy add commitizen baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs-extra');
const path = require('path');
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
 * @param {string} tplName - 使用的模板名称
 * @param {string} dir - 配置写入的路径
 */
module.exports = async (rule, tplName, dir) => {
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
    await setConfig(cliSourcePath, dir, 'commitizen');

    await installPkg(adapter);
    // eslint-disable-next-line
    const adapterSourcePath = await getConfigFilePath(adapterConfigFile[adapter], tplName, adapterConfigFile);
    await copyFile(adapterSourcePath, getConfigTargetPath(adapterSourcePath));

    // add `npm run commit` in pkg
    editPkg(['scripts', 'commit'], 'git-cz');
};

async function setConfig(source, dir, configName) {
    if (dir === 'package.json' && !configName) { // set config in package.json
        const config = fs.readJsonSync(source);
        Object.keys(config).map(key => {
            editPkg(['config', configName, key], config[key]);
        });
    }
    else if (!!dir) { // copy file to custom dir
        const fileName = path.basename(source);
        const target = path.resolve(dir, fileName);
        await copyFile(source, target);
    }
    else { // default copy file in root
        const target = getConfigTargetPath(source);
        await copyFile(source, target);
    }
}
