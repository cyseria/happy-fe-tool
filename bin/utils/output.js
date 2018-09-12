/**
 * @file 一些输出统一处理模块
 * @author Cyseria <xcyseria@gmail.com>
 */

const chalk = require('chalk');

module.exports = {
    handleErr(err) {
        console.log(chalk.red(err));
        process.exit(1);
    },
    handleInfo(info) {
        console.log(chalk.yellow(info));
    }
};
