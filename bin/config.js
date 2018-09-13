const path = require('path');

// 仅供当做参考的配置格式, 没有地方使用
exports.ruleTmp = {
    nvm: true,
    prettier: '', // prettier 配置路径
    commitizen: ['cz-customizable', 'cz-conventional-changelog'], // commitizen 配置
    commitlint: false,
    changelog: {
        preset: ['angular', '@baidu/befe'],
        hooks: ''
    },
    codelint: {
        name: ['fecs', 'eslint'],
        hooks: 'pre-commit'
    },
    test: {
        type: 'jest',
        hooks: 'pre-push'
    }
};

// 实际使用配置
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
