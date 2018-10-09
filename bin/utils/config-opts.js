/**
 * @file 配置的一些基础操作
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const {tpls} = require('../../templates/config');
const {handleErr} = require('./output');

/**
 * 获取模板中符合条件的配置文件路径
 * @param {(string|Object) | {name: string, content: string}} rule - 使用的模板配置
 * @param {string} tplName - 使用的模板名称
 * @param {string | Array} supportFile - 支持的配置文件名称
 * @return {string} source path
 */
exports.getConfigSourcePath = async (rule, tplName, supportFile) => {
    const ruleContent = rule.content || rule;
    // 1. 如果用户有提供配置则优先使用用户提供的配置文件
    if (typeof ruleContent === 'string') {
        const sourcePath = path.resolve(__dirname, '../../templates', tplName, ruleContent);
        if (fs.pathExistsSync(sourcePath)) {
            return sourcePath;
        }
    }

    // 2. 如果提供的配置文件不正确, 则去查找当前 tpl 文件夹下的所有支持类型, 返回第一个找到的
    if (typeof supportFile === 'string') {
        supportFile = [supportFile];
    }

    const existsConf = supportFile.filter(item => {
        const tmpPath = path.resolve(__dirname, '../templates', tplName, item);
        return fs.pathExistsSync(tmpPath);
    });

    if (existsConf.length > 0) {
        return path.resolve(__dirname, '../templates', tplName, existsConf[0]);
    }

    // 3. 如果在当前 tpl 都找不到对应的文件, 提供所有符合条件的 tpl 让用户选择
    const existTpl = Object.keys(tpls).filter(tpl => {
        if (Object.prototype.hasOwnProperty.call(tpls[tpl], rule.name) && supportFile.includes(tpls[tpl][rule.name])) {
            const tmpPath = path.resolve(__dirname, '../templates', tpl, tpls[tpl][rule.name]);
            return fs.pathExistsSync(tmpPath);
        }

    });
    if (existTpl.length > 0) {
        const userInput = await inquirer.prompt([
            {
                type: 'list',
                name: 'templates',
                message: `can't find ${rule.name} in ${tplName},choose a exsit templates: `,
                choices: existTpl
            }
        ]);
        const templates = userInput.templates;
        return path.resolve(__dirname, '../templates', templates, tpls[templates][rule.name]);
    }
    else {
        handleErr(`找不到 ${ruleContent} 的配置文件了啦, 请检查配置信息, tpl: ${tplName}`);
        process.exit(1);
    }
};

/**
 * 根据模板配置的文件, 获取需要在当前项目创建的配置文件路径
 * @param {string} sourcePath - 模板文件的位置
 * @return {string} target path
 */
exports.getConfigTargetPath = sourcePath => {
    const fileName = path.basename(sourcePath);
    return path.resolve(process.cwd(), fileName);
};

/**
 * 获取安装 husky 的版本信息
 * @param {boolean} moyuycHusky 是否使用自定义的 husky
 * @returns {{install, edit}}
 */
exports.getHuskyConfig = moyuycHusky => {
    const pkgOpt = {install: [], edit: []};
    // baidu, 存在 commit-msg, husky 会自动忽略, 使用临时解决方案
    if (moyuycHusky) {
        pkgOpt.install = ['@moyuyc/husky'];
        pkgOpt.edit.push({
            path: ['husky', 'installType'],
            content: 'append'
        });
    }
    else {
        pkgOpt.install = ['husky'];
    }
    return pkgOpt;
};

/**
 * 获取安装 husky 的信息
 * @param {Object} hooksConfig - hooks 的配置信息 eg. {"pre-commit": "npm run changelog"}
 * @param {boolean} moyuycHusky - 是否使用自定义 husky
 */
exports.installHusky = (hooksConfig, moyuycHusky) => {
    // 使用 husky 来安装 git hooks
    const {install, edit} = exports.getHuskyConfig(moyuycHusky || '');
    if (Object.prototype.toString.call(hooksConfig) !== '[object Object]') {
        return;
    }

    Object.keys(hooksConfig).forEach(hookname => {
        edit.push({
            path: ['husky', 'hooks', hookname],
            content: hooksConfig[hookname]
        });
    });

    return {install, edit};
};

/**
 * 返回配置文件内容，或者配置文件路径
 * fecs/pettie 等只能将规则写入 package, 而有一些提供路径就好，所以分开处理一下
 * @param {string} type - 'file'/'type
 * @param {sting} sourcePath -
 * @param {sting|undefined} dir - 配置文件的路径
 */
exports.getConfigValue = async (type, sourcePath, dir) => {
    if (type === 'file') {
        const sourceJson = await fs.readJson(sourcePath);
        return sourceJson;
    }
    else if (type === 'path') {
        const relativePath = !!dir ? path.relative(process.cwd(), dir) : dir;
        const fileName = path.basename(sourcePath);
        return relativePath ? path.join(relativePath, fileName) : '';
    }

};
