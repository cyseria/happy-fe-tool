/**
 * @file 获取用户输入 & 一些字段的检验等
 * @author cyseria <xcyseria@gmail.com>
 */

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const {tpls} = require('../../templates/config');
const {handleInfo} = require('./output');

exports.getTplFromCmd = async cmd => {
    // get config tpl
    // if set options -y, use default
    // if set custom tpl by -t, use custom
    // otherwise, let user choose from config tpls
    const userInput = await inquirer.prompt([
        {
            type: 'list',
            name: 'tpl',
            message: 'choose a template: ',
            choices: Object.keys(tpls), // todo: exsit key
            when() {
                return !cmd.tpl && !cmd.yes;
            }
        }
    ]);
    let tpl = userInput.tpl || '';
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
exports.getDirFromCmd = async cmd => {
    let dir = undefined;
    if (cmd.dir === true) {
        // 配置写进 package.json 中
        dir = path.resolve(process.cwd(), './happy-config');
        fs.ensureDir(dir);
    }
    else if (!!cmd.dir) {
        // 配置写进在自定义目录里面
        dir = path.resolve(process.cwd(), cmd.dir);
        fs.ensureDir(dir);
    }

    return dir;
};
