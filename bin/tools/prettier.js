/**
 * @file prettier.js, cmd: happy add prettier baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const {types} = require('../config');
const {handleErr, handleSuccess} = require('../utils/output');
const copyFile = require('../utils/copy');

module.exports = async function(type, name) {
    try {
        let sourcePath = '';
        const file = types[type][name];
        if (typeof file === 'string') {
            sourcePath = path.resolve(__dirname, './templates', type, file);
        } else {
            // confugyration file, see https://prettier.io/docs/en/configuration.html
            const supportConfFile = [
                '.prettierrc.yaml',
                '.prettierrc.yml',
                '.prettierrc.json',
                '.prettierrc.toml',
                'prettier.config.js',
                '.prettierrc.js'
            ];
            // prettier: true, 自动查找响应的配置, 兼容处理
            const existsConf = supportConfFile.filter(item => {
                const tmpPath = path.resolve(__dirname, '../templates', type, item);
                return fs.existsSync(tmpPath);
            });
            if (existsConf.length === 0) {
                handleErr(`没有在 ${type} 中找到配置文件`);
                exit(1);
            }
            sourcePath = path.resolve(__dirname, '../templates', defaultConf, existsConf[0]);
        }

        const fileName = path.basename(sourcePath);
        const targetPath = path.resolve(process.cwd(), fileName);
        await copyFile(sourcePath, targetPath);

        handleSuccess('✨ prettier 配置添加完毕, 请配合编辑器食用~');
    } catch (err) {
        handleErr(err);
        process.exit(1);
    }
};
