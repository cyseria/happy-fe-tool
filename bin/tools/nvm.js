/**
 * @file Node Version Manager, see https://github.com/creationix/nvm
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const {handleErr} = require('../utils/output');

/**
 * 初始化 nvm
 * @param {{name: string, content: string|Object}} rule - 规则相关的配置
 * @param {string}} tplName - 使用的模板名称
 */
module.exports = async rule => {
    // if no config, use current node version
    let content = '';
    if (!!rule.content) {
        content = rule.content;
    }
    else {
        const {stdout} = await execa.shell('node -v');
        content = stdout;
    }
    const configFileName = '.nvmrc';
    const file = path.resolve(process.cwd(), configFileName);
    fs.outputFileSync(file, content);
};
