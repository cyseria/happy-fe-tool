/**
 * @file 仅供当做参考的配置格式
 * @author cyseria <xcyseria@gmail.com>
 */

const configExample = {
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
