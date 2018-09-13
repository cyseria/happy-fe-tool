/**
 * @file install package
 * @author Cyseria <xcyseria@gmail.com>
 */

// const fs = require('fs');
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const execa = require('execa');
const {handleErr, handleInfo, handleSuccess} = require('./output');

/**
 * 安装包内容
 * @param {string|Array} module - modulename
 * @param {Boolean} exclusive - 3 exclusive, optional flags which save or update the package version, eg. -S, -D, -O
 */
exports.installPkg = async function(module, exclusive) {
    try {
        if (Array.isArray(module)) {
            module = module.join(' ');
        }
        if (!exclusive) {
            exclusive = '-D';
        }
        exports.pkgUp();
        const spinner = ora(`install package ${module}, please wait a min...`).start();
        await execa.shellSync(`npm install ${module} ${exclusive}`);
        spinner.succeed(`add ${module} success`);
    } catch (error) {
        handleErr(error);
    }
};

exports.uninstallPkg = async function(module, isdev) {
    try {
    } catch (error) {
        handleErr(error);
    }
};

/**
 * 检测 package.json 是否存在的
 * TODO: 递归查找父级
 */
exports.pkgUp = async function() {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    if (!fs.pathExistsSync(pkgPath)) {
        await execa.shellSync('npm init -y');
    }
};
/**
 * 修改 package.json 中的字段
 * @param {string} type - eg. 'scripts', 'config'
 * @param {string} key - key
 * @param {any} value - value
 */
exports.editPkg = function(type, key, value) {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkgObj = fs.readJsonSync(pkgPath);

    if (!pkgObj[type]) {
        pkgObj[type] = {};
    }

    const conf = pkgObj[type];
    // 如果已经存在该 key 且没该 value, 在后面加上 && xxx
    if (!!conf[key]) {
        const scriptArr = conf[key].split('&&');
        conf[key] = scriptArr.includes(value) ? conf[key] : conf[key] + ' && ' + value;
    } else {
        conf[key] = value;
    }
    
    fs.writeJsonSync(pkgPath, pkgObj, {spaces: 4});
};
