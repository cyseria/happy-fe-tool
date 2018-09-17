/**
 * @file install package
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const execa = require('execa');
const {
    handleErr,
    handleInfo,
    handleSuccess
} = require('./output');

/**
 * 安装包内容
 * @param {string|Array} module - modulename
 * @param {Boolean} exclusive - 3 exclusive, optional flags which save or update the package version, eg. -S, -D, -O
 * @param {Object} config - npm config, like registry
 */
exports.installPkg = async (module, exclusive, config) => {
    try {
        exports.pkgUp();
        const installModule = getInstallModule(module);
        if (installModule.length === 0) {
            return;
        }

        if (!exclusive) {
            exclusive = '-D';
        }

        const installStr = installModule.join(' ');
        const spinner = ora(`install package ${installStr}, please wait a min...`).start();

        let configStr = '';
        if (!!config) {
            for (let key in config) {
                if (!!config[key]) {
                    configStr += ` --${key}=${config[key]}`;
                }

            }
        }

        await execa.shellSync(`npm install ${installStr} ${exclusive} ${configStr}`);
        spinner.succeed(`add package ${installStr} success`);
    }
    catch (error) {
        handleErr(error);
    }
};

exports.uninstallPkg = async (module, isdev) => {
    try {
    }
    catch (error) {
        handleErr(error);
    }
};

/**
 * 检测 package.json 是否存在的, 如果不存在就创建一个
 * TODO: 递归查找父级
 */
exports.pkgUp = async () => {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    if (!fs.pathExistsSync(pkgPath)) {
        await execa.shellSync('npm init -y');
    }

};

/**
 * 新增/修改 package.json 中的字段
 * @param {Array} keys - eg. ['scripts', 'test'], ['config', 'commitizen']
 * @param {any} value - value
 *
 * @example
 * editPkg(['scripts', 'test'], 'jest')
 * => {scripts: {test: 'jest'}}
 */
exports.editPkg = (keys, value) => {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const length = keys.length;
    const pkgObj = fs.readJsonSync(pkgPath);
    let newObj = Object.assign({}, pkgObj);

    if (Array.isArray(keys) && keys.length > 0) {
        keys.map((key, index) => {
            if (!newObj.hasOwnProperty(key)) {
                newObj[key] = {};
            }

            if (index === length - 1) {
                if (Object.keys(newObj[key]).length > 0) {
                    const oldScriptArr = newObj[key].split('&&');
                    const newScriptArr = value.split('&&');
                    newObj[key] = concatAndUniqueArr(oldScriptArr, newScriptArr).join(' && ');
                }
                else {
                    newObj[key] = value;
                }
            }
            else {
                newObj = newObj[key];
            }
        });
    }

    fs.writeJsonSync(pkgPath, pkgObj, {
        spaces: 4
    });
};

exports.addHooks = (hook, script) => {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkgObj = fs.readJsonSync(pkgPath);

    if (!pkgObj.husky) {
        pkgObj.husky = {};
    }

    const husky = pkgObj.husky;

    if (!husky.hooks) {
        husky.hooks = {};
    }

    const hooks = husky.hooks;

    // 如果已经存在该 key 且没该 value, 在后面加上 && xxx
    if (!!hooks[hook]) {
        const scriptArr = hooks[hook].split('&&');
        hooks[hook] = scriptArr.includes(script) ? hooks[hook] : hooks[hook] + ' && ' + script;
    }
    else {
        hooks[hook] = script;
    }

    fs.writeJsonSync(pkgPath, pkgObj, {
        spaces: 4
    });
};

/**
 * 合并数组并去重
 * @param {Array} arr1
 * @param {Array} arr2
 */
function concatAndUniqueArr(arr1, arr2) {
    const concatArr = [...arr1, ...arr2];
    const arr = concatArr.map(item => item.replace(/^\s+|\s+$/g, '')); // 去除前后空格
    const set = new Set(arr);
    return Array.from(set);
}

/**
 * 判断是否存在模块, 检查 devDependencies 和 dependencies 字段
 * @param {string|Array} name - 模块名称
 * @return {Array} 需要安装的 module
 */
function getInstallModule(moduleName) {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkgObj = fs.readJsonSync(pkgPath);
    const checkArr = ['devDependencies', 'dependencies'];

    const needInstallModule = [];
    if (Array.isArray(moduleName)) {
        moduleName.map(item => {
            if (!isRepeat(item)) {
                needInstallModule.push(item);
            }

        });
    }
    else if (typeof moduleName === 'string' && !isRepeat(moduleName)) {
        needInstallModule.push(moduleName);
    }

    return needInstallModule;

    // 检查需要安装的 module 是否已经存在
    function isRepeat(module) {
        const moduleWriteName = module.split('@')[0];
        return checkArr.some(item => {
            if (Object.prototype.hasOwnProperty.call(pkgObj, item)) {
                return Object.keys(pkgObj[item]).includes(moduleWriteName);
            }

            return false;
        });
    }
}
