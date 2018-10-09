/**
 * @file happy add changelog -t baidu
 * @author Cyseria <xcyseria@gmail.com>
 */

const {getHuskyConfig} = require('../utils/config-opts');

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
    if (!!preset && typeof preset === 'string') {
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

    if (!!toolConfig.content.hooks) {
        const husky = getHuskyConfig(opts.moyuycHusky || '');
        pkgOpts.install = pkgOpts.install.concat(husky.install);
        pkgOpts.edit = pkgOpts.edit.concat(husky.edit);

        pkgOpts.edit.push({
            path: ['husky', 'hooks', toolConfig.content.hooks],
            content: 'npm run changelog'
        });
    }

    return {pkgOpts, copyOpts};
};
