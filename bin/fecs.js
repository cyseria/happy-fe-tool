/**
 * @file fecs 相关
 * @author Cyseria <xcyseria@gmail.com>
 * @created time: 2018-06-28 00:11:52
 * @last modified by: Cyseria
 * @last modified time: 2018-07-01 18:40:56
 */


const utils = require('./utils/utils');

function installHooks() {
    try {
        utils.installHooks('pre-commit');
        console.log('fecs pre-commit hooks 安装成功');
    }
    catch (e) {
        console.trace(e);
    }
}
function unInstallHooks() {
    try {
        utils.unInstallHooks('pre-commit');
        console.log('fecs pre-commit hooks 移除成功');
    }
    catch (e) {
        console.trace(e);
    }
}
module.exports = function (command, level) {
    if (command === 'install') {
        installHooks();
    } else if (command === 'uninstall') {
        unInstallHooks();
    } else {
        console.log('命令错误');
    }
};
