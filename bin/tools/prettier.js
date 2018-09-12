/**
 * @file prettier.js, cmd: happy add prettier baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const {handleErr, handleInfo} = require('../utils/output');
const copyFile = require('../utils/copy');

module.exports = async function(sourcePath) {
    try {
        /* default use baidu config */
        if (!sourcePath) {
            const defaultConf = 'baidu';
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
                const tmpPath = path.resolve(__dirname, '../templates', defaultConf, item);
                return fs.existsSync(tmpPath);
            });
            if (existsConf.length === 0) {
                handleErr(`没有找到默认的配置文件`);
                exit(1);
            }
            sourcePath = path.resolve(__dirname, '../templates', defaultConf, existsConf[0]);
        }

        const fileName = path.basename(sourcePath);
        const targetPath = path.resolve(process.cwd(), fileName);
        await copyFile(sourcePath, targetPath);

        handleInfo('✨ prettier 配置安装完成, 请配合编辑器食用~');
    } catch (err) {
        handleErr(err);
        process.exit(1);
    }
};
