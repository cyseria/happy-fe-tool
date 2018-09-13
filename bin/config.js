const path = require('path');

exports.ruleTmp = {
    nvm: true,
    prettier: '', // prettier 配置路径
    commitizen: ['cz-customizable', 'cz-conventional-changelog'], // commitizen 配置
    commitlint: false,
    changelog: true,
    codelint: {
        type: 'fecs',
        hooks: 'pre-commit'
    },
    test: {
        type: 'jest',
        hooks: 'pre-push'
    }
};

exports.types = {
    baidu: {
        nvm: true,
        prettier: path.resolve(__dirname, './templates/baidu/.prettierrc.js'),
        commitizen: 'cz-customizable',
        commitlint: false,
        codelint: {
            type: 'fecs',
            hooks: 'pre-commit'
        },
        changelog: true,
        test: {
            type: 'jest',
            hooks: 'pre-push'
        }
    },
    angular: {
        prettier: '',
        commitizen: true
    },
    aaa: {
        commitizen: true
    }
};
