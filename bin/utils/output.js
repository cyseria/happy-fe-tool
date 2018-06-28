/**
 * @file 一些输出统一处理模块
 * @author Cyseria <xcyseria@gmail.com>
 * @created time: 2018-06-20 10:45:13
 * @last modified by: Cyseria
 * @last modified time: 2018-06-28 10:19:47
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
