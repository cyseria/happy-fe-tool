/**
 * @file 交互提示相关配置获取
 * @author Cyseria <cyseria@gmail.com>
 */

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const {tpls} = require('../../templates/config');
const {handleInfo} = require('./output');

/**
 * 获取配置模板信息
 * @param {object} cmd - 用户输入的命令
 * @return {string} - eg.baidu, default "default"
 */
exports.getTplFromCmd = async (cmd, defaultTpl) => {
    const userInput = await inquirer.prompt([
        {
            type: 'list',
            name: 'tpl',
            message: 'choose a template: ',
            choices: Object.keys(tpls), // todo: exsit key
            when() {
                return !defaultTpl && !cmd.tpl && !cmd.yes;
            }
        }
    ]);
    let tpl = userInput.tpl || defaultTpl;
    if (!!cmd.tpl && Object.keys(tpls).includes(cmd.tpl)) {
        tpl = cmd.tpl;
    }
    else if (!!cmd.tpl) {
        handleInfo(
            `can't find ${cmd.tpl} in config, please check and try again. 
use -y by default config, or use init and follow guide`
        );
    }
    else if (!!cmd.yes) {
        tpl = 'default';
    }

    return tpl;
};

/**
 * 获取配置文件写入的路径
 * @param {object} cmd - 用户输入的命令
 * @return {string|undefined} 如果是 package.json 则写进 package 的 config 里面，否则为文件夹内
 */
exports.getDirFromCmd = async (customDir, defaultDir = './happy-config') => {
    let dir = undefined;
    if (customDir === true) {
        // 配置写进 package.json 中
        dir = path.resolve(process.cwd(), defaultDir);
        fs.ensureDir(dir);
    }
    else if (!!customDir) {
        // 配置写进在自定义目录里面
        dir = path.resolve(process.cwd(), customDir);
        fs.ensureDir(dir);
    }

    return dir;
};

exports.getToolsFromTpl = async tpl => {
    const toolsConfig = tpls[tpl];
    const choices = Object.keys(toolsConfig.tools).map(item => {
        return {
            name: item
        };
    });
    const answers = await inquirer.prompt([
        {
            type: 'checkbox',
            name: 'tools',
            message: 'Select the tools you want to add: ',
            choices: choices
        }
    ]);
    return answers.tools;
};

exports.confirmFileCover = async target => {
    const confirm = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'iscover',
            message: `文件 ${path.basename(target)} 已存在, 是否覆盖?`
        }
    ]);
    return confirm.iscover;
};
