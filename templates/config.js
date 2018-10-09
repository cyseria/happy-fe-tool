/**
 * @file 在项目中有用到的配置
 * @author cyseria <xcyseria@gmail.com>
 */

exports.tpls = {
    // baidu fe 规范
    baidu: {
        // basic tools config
        tools: {
            nvm: 'v8.11.3',
            prettier: '.prettierrc', // config file
            commitizen: 'cz-customizable', // adapter, required
            codelint: {
                lintTool: 'fecs',
                lintConfigFile: '.fecsrc',
                lintStagedConfigFile: '.lintstagedrc',
                hooks: 'pre-commit'
            },
            changelog: { // 默认添加 changelog & version script
                preset: {
                    name: '@baidu/befe',
                    dependency: ['@baidu/conventional-changelog-befe', 'tranz', '@baidu/tranz-commit-icafe'],
                    registry: 'http://registry.npm.baidu-int.com'
                },
                hooks: {
                    'pre-push': 'npm run changelog',
                    'commit-msg': 'tranz $HUSKY_GIT_PARAMS --write'
                }
            }
        },
        // other config
        options: {
            moyuycHusky: true, // icode 默认会注入 commit-msg 钩子，导致 husky 挂载失败，进而导致 commitlint 不触发。相关 issue https://github.com/typicode/husky/issues/336
            defaultConfigDir: './baidu-config', // 使用 -d 的时候默认配置的路径
            extraConfig: { // 依赖的配置可能需要添加的一些路径信息
                icafe: {
                    spaceId: 'auto'
                },
                tranz: {
                    processors: ['@baidu/tranz-commit-icafe']
                }
            }
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
