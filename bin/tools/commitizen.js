/**
 * @file happy add commitizen baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const {ruleTmp, types} = require('../config');
const {handleErr, handleInfo} = require('../utils/output');
const {installPkg, editPkg} = require('../utils/pkg');
const copyFile = require('../utils/copy');

const supportConf = {
    cli: '.czrc',
    adapter: {
        'cz-customizable': '.cz-config.js'
    }
};
/**
 * 安装 commitizen, 和对应规则
 * @param {string} adapters - see https://github.com/commitizen/cz-cli#adapters
 */
module.exports = async function(type, name) {
    try {
        const adapters = types[type][name];

        // if commitizen config is error, let user choose
        const userInput = await inquirer.prompt([
            {
                type: 'list',
                name: 'adapter',
                message: 'choose a adapters for commitizen: ',
                choices: ruleTmp['commitizen'],
                when() {
                    return !adapters || !ruleTmp['commitizen'].includes(adapters);
                }
            }
        ]);
        const adapter = userInput.adapter || adapters;

        // install commitizen, adapter and copy there config to root dir
        const cliConfPath = path.resolve(__dirname, '../templates', type, supportConf['cli']);
        const adapterConfPath = path.resolve(__dirname, '../templates', type, supportConf['adapter'][adapter]);

        if (!fs.existsSync(cliConfPath) || !fs.existsSync(adapterConfPath)) {
            handleErr(`没有在 ${type} 中找到 ${name} 的配置文件`);
            exit(1);
        }
        await installPkg('commitizen');
        await installPkg(adapter);
        await copyFile(cliConfPath, path.resolve(process.cwd(), supportConf['cli']));
        await copyFile(adapterConfPath, path.resolve(process.cwd(), supportConf['adapter'][adapter]));

        // add `npm run commit` in pkg
        editPkg('scripts', 'commit', 'git-cz');

    } catch (err) {
        handleErr(err);
        process.exit(1);
    }
};
