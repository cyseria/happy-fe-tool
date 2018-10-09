/**
 * @file happy add changelog -t baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const {installHusky} = require('../utils/config-opts');

/**
 * 安装 changelog 相关信息
 * @param {{name: string, content: string|Object}} toolConfig - 规则相关的配置
 * @param {string}} tplName - 使用的模板名称
 * @param {{configDir: string|undefined, moyuycHusky: boolean}} opts - 其他配置
 *
 * @example
 * toolConfig = {
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
 *
 * @returns {{copyOpts, pkgOpts}}
 */
module.exports = async (toolConfig, tplName, opts) => {
    const copyOpts = [];
    const pkgOpts = {install: [], edit: []};

    pkgOpts.install.push('conventional-changelog-cli');

    const preset = toolConfig.content.preset;
    let presetName = 'angular';
    if (typeof preset === 'string') {
        presetName = preset;
    }
    else if (Object.prototype.toString.call(preset) === '[object Object]') {
        presetName = preset.name;

        if (typeof preset.dependency === 'string') {
            pkgOpts.install.push({
                moduleName: preset.dependency,
                config: {
                    registry: preset.registry || ''
                }
            });
        }
        else if (Array.isArray(preset.dependency)) {
            preset.dependency.forEach(item => {
                pkgOpts.install.push({
                    moduleName: item,
                    config: {
                        registry: preset.registry || ''
                    }
                });
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

    const {hooks} = toolConfig.content;
    if (!hooks) {
        return {pkgOpts, copyOpts};
    }

    let hooksConfig = {};
    if (typeof hooks === 'string') {
        hooksConfig[hooks] = 'npm run changelog';
    }
    else {
        hooksConfig = hooks;
    }
    const huskyOpts = installHusky(hooksConfig, opts.moyuycHusky);

    pkgOpts.install = [...pkgOpts.install, ...huskyOpts.install];
    pkgOpts.edit = [...pkgOpts.edit, ...huskyOpts.edit];

    return {pkgOpts, copyOpts};
};
