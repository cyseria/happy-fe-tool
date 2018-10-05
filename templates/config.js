/**
 * @file 在项目中有用到的配置
 * @author cyseria <xcyseria@gmail.com>
 */

exports.tpls = {
    baidu: {
        // baidu fe 规范
        nvm: '',
        prettier: '.prettierrc.js', // config file
        commitizen: 'cz-customizable', // adapter, required
        codelint: {
            lintTool: 'fecs',
            lintConfigFile: '.fecsrc',
            lintStagedConfigFile: '.lintstagedrc',
            hooks: 'pre-commit',
            moyuycHusky: true // icode 默认会注入 commit-msg 钩子，导致 husky 挂载失败，进而导致 commitlint 不触发。相关 issue https://github.com/typicode/husky/issues/336
        },
        changelog: {
            preset: {
                name: '@baidu/befe',
                dependency: '@baidu/conventional-changelog-befe',
                registry: 'http://registry.npm.baidu-int.com'
            },
            hooks: 'pre-push',
            moyuycHusky: true
        }
        // test: {
        //     testTool: 'jest',
        //     covTool: ''
        // }
    },
    simple: {
        // 其他项目
        commitizen: 'cz-customizable', // adapter, required
        changelog: {
            preset: 'angular',
            hooks: 'pre-push'
        }
    }
};
