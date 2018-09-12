/**
 * @file prettier.js
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const {handleErr, handleInfo} = require('../utils/output');
const copyFile = require('../utils/copy');

module.exports = async function(type) {
    try {
        /* copy config file */

        // confugyration file, see https://prettier.io/docs/en/configuration.html
        const supportConfFile = [
            '.prettierrc.yaml',
            '.prettierrc.yml',
            '.prettierrc.json',
            '.prettierrc.toml',
            'prettier.config.js',
            '.prettierrc.js'
        ];
        const existsConf = supportConfFile.filter(item => {
            const tmpPath = path.resolve(__dirname, '../templates', type, item);
            return fs.existsSync(tmpPath);
        });
        if (existsConf.length === 0) {
            handleErr(`${type} tpl 下没有配置文件`);
            exit(1);
        }
        const sourcePath = path.resolve(__dirname, '../templates', type, existsConf[0]);
        const targetPath = path.resolve(process.cwd(), existsConf[0]);
        await copyFile(sourcePath, targetPath);

        handleInfo('✨ prettier 配置安装完成, 请配合编辑器食用~')
    } catch (err) {
        handleErr(err);
        process.exit(1);
    }
};
