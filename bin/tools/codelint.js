/**
 * @file happy add codelint baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const {ruleTmp, types} = require('../config');
const {installPkg, editPkg, addHooks} = require('../utils/pkg');
const {handleErr, handleInfo} = require('../utils/output');
const copyFile = require('../utils/copy');

// 配合 husky 和 lint-staged 来构建代码检查工作流
module.exports = async function(type, name) {
    try {
        const config = types[type][name]; // eg. {name: 'fecs', hooks: 'pre-commit'}
        const configFile = {
            fecs: '.fecsrc'
        };
        const configFileName = configFile[config.name];

        installPkg(config.name);
        const sourcePath = path.resolve(__dirname, '../templates', type, configFileName);
        const targetPath = path.resolve(process.cwd(), configFileName);
        await copyFile(sourcePath, targetPath);

        editPkg('scripts', 'fecs', 'fecs format --replace true && fecs check --level 2');

        // baidu, 存在 commit-msg, husky 会自动忽略, 使用临时解决方案
        if (config.type === 'baidu' && config.hooks === 'commit-msg') {
            // TODO: if hooks === commit-msg, use personal package
        } else if (!!config.hooks) {
            installPkg(['husky', 'lint-staged']);

            // lint-staged config: https://github.com/okonet/lint-staged#configuration
            const supportLintConfFile = ['.lintstagedrc', 'lint-staged.config.js'];
            
            const existsConf = supportLintConfFile.filter(item => {
                const tmpPath = path.resolve(__dirname, '../templates', type, item);
                return fs.existsSync(tmpPath);
            });
            if (existsConf.length === 0) {
                handleErr(`没有在 ${type} 中找到 lint-staged 的配置文件`);
                exit(1);
            }
            const sourcePath = path.resolve(__dirname, '../templates', type, existsConf[0]);
            const targetPath = path.resolve(process.cwd(), existsConf[0]);
            await copyFile(sourcePath, targetPath);
            addHooks(config.hooks, 'npm run fecs');
        }
    } catch (err) {
        handleErr(err);
        process.exit(1);
    }
};
