const path = require('path');

exports.ruleTmp = {
    nvm: true,
    prettier: '', // prettier 配置路径
    commitizen: ['cz-customizable', 'cz-conventional-changelog'], // commitizen 配置
    commitlint: false,
    changelog: {
        name: ['angular', '@baidu/befe'],
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

exports.types = {
    baidu: { // baidu fe 规范
        nvm: true,
        prettier: path.resolve(__dirname, './templates/baidu/.prettierrc.js'),
        commitizen: 'cz-customizable',
        commitlint: false,
        codelint: {
            name: 'fecs',
            hooks: 'pre-commit'
        },
        changelog: {
            name: '@baidu/befe',
            hooks: 'pre-push'
        },
        test: {
            name: 'jest',
            hooks: 'pre-push'
        }
    },
    simple: { // 给其他语言用的
        commitizen: true
    },
    angular: {
        prettier: '',
        commitizen: true
    }
};
