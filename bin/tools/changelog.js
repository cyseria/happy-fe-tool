/**
 * @file
 * @author Cyseria <xcyseria@gmail.com>
 */

const {
    installPkg,
    editPkg
} = require('../utils/pkg');

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
    installPkg('conventional-changelog-cli');

    const preset = rule.content.preset;
    let presetName = '';
    if (typeof preset === 'string') {
        presetName = preset;
    }
    else if (Object.prototype.toString.call(preset) === '[object Object]') {
        presetName = preset.name;
        if (!!preset.dependency) {
            installPkg(preset.dependency, '', {
                registry: preset.registry || ''
            });
        }
    }

    editPkg(
        ['scripts', 'changelog'],
        `conventional-changelog -p ${presetName} -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md`
    );
    editPkg(['scripts', 'version'], 'npm run changelog');

    if (!!rule.content.hooks) {
        editPkg(['husky', 'hooks', rule.content.hooks], 'npm run changelog');
    }
};
