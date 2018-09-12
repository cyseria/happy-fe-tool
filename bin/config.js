const path = require('path');

exports.ruleTmp = {
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
        prettier: path.resolve(__dirname, './templates/baidu/.prettierrc.js'),
        commitizen: true,
        commitlint: false,
        changelog: true,
        codelint: 'fecs',
        test: 'jest',
        hooks: {
            'pre-commit': 'codelint',
            'pre-push': 'test'
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
