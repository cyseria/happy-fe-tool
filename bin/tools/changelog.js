/**
 * @file happy add changelog -t baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const {getHuskyConfig} = require('../utils/configOpt');

/**
 * 安装 changelog 相关信息
 * @param {{name: string, content: string|Object}} rule - 规则相关的配置
 * @param {string}} tplName - 使用的模板名称
 *
 * @example
 * rule = {
 *      name: 'changelog',
 *      content: {
 *          preset: {
 *              name: '@baidu/befe',
 *              dependency: '@baidu/conventional-changelog-befe',
 *              registry: 'http://registry.npm.baidu-int.com'
 *          },
 *          hooks: 'pre-push'
 *      }
 * }
 */
module.exports = async (rule, tplName) => {
    const copyOpts = [];
    const pkgOpts = {install: [], edit: []};

    pkgOpts.install.push('conventional-changelog-cli');

    const preset = rule.content.preset;
    let presetName = '';
    if (typeof preset === 'string') {
        presetName = preset;
    }
    else if (Object.prototype.toString.call(preset) === '[object Object]') {
        presetName = preset.name;

        if (!!preset.dependency) {
            pkgOpts.install.push({
                moduleName: preset.dependency,
                config: {
                    registry: preset.registry || ''
                }
            });
        }
    }

    pkgOpts.edit.push({
        path: ['scripts', 'changelog'],
        content: `conventional-changelog -p ${presetName} -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md`
    });
    pkgOpts.edit.push({
        path: ['scripts', 'version'],
        content: 'npm run changelog'
    });

    if (!!rule.content.hooks) {
        const husky = getHuskyConfig(rule.content.moyuycHusky || '');
        pkgOpts.install = pkgOpts.install.concat(husky.install);
        pkgOpts.edit = pkgOpts.edit.concat(husky.edit);

        pkgOpts.edit.push({
            path: ['husky', 'hooks', rule.content.hooks],
            content: 'npm run changelog'
        });
    }

    return {pkgOpts, copyOpts};
};
