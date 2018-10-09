/**
 * @file 在项目中有用到的配置
 * @author cyseria <xcyseria@gmail.com>
 */

exports.tpls = {
    // baidu fe 规范
    baidu: {
        // basic tools config
        tools: {
            nvm: '',
            prettier: '.prettierrc', // config file
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
        // other config
        options: {
            moyuycHusky: true, // icode 默认会注入 commit-msg 钩子，导致 husky 挂载失败，进而导致 commitlint 不触发。相关 issue https://github.com/typicode/husky/issues/336
            defaultConfigDir: './baidu-config' // 使用 -d 的时候默认配置的路径
        }
    },
    angular: {
        // 其他项目
        tools: {
            nvm: '',
            prettier: '.prettierrc',
            commitizen: 'cz-customizable',
            changelog: {
                preset: 'angular',
                hooks: 'pre-push'
            }
        }
    }
};
