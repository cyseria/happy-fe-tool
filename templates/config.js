/**
 * @file 在项目中有用到的配置
 * @author cyseria <xcyseria@gmail.com>
 */

exports.tpls = {
    baidu: {
        // baidu fe 规范
        nvm: true,
        prettier: '.prettierrc.js', // config file
        commitizen: 'cz-customizable', // adapter, required
        codelint: {
            lintTool: 'fecs',
            lintConfigFile: '.fecsrc',
            lintStagedConfigFile: '.lintstagedrc',
            hooks: 'pre-commit'
        },
        changelog: {
            preset: {
                name: '@baidu/befe',
                dependency: '@baidu/conventional-changelog-befe',
                registry: 'http://registry.npm.baidu-int.com'
            },
            hooks: 'pre-push'
        }
    },
    simple: {
        // 给其他语言用的
        commitizen: true,
        prettier: '.prett'
    },
    angular: {
        prettier: '.prettierrc.js',
        commitizen: 'cz-conventional-changelog'
    }
};
