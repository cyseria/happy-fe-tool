'use strict';

module.exports = {
    types: [
        {
            value: '💪  WIP',
            name: '💪  WIP:      Work in progress'
        },
        {
            value: '✨  feat',
            name: '✨  feat:     A new feature'
        },
        {
            value: '🐞  fix',
            name: '🐞  fix:      A bug fix'
        },
        {
            value: '🛠  refactor',
            name: '🛠   refactor: A code change that neither fixes a bug nor adds a feature'
        },
        {
            value: '📚  docs',
            name: '📚  docs:     Documentation only changes'
        },
        {
            value: '🏁  test',
            name: '🏁  test:     Add missing tests or correcting existing tests'
        },
        {
            value: '🚥  ci',
            name: '🚥  ci:      Changes to our CI configuration files and scripts'
        },
        {
            value: '🗯  chore',
            name: "🗯  chore:    Changes that don't modify src or test files. Such as updating package manager"
        },
        {
            value: '🚀  perf',
            name: '🚀  perf:      A code change that improves performance'
        },
        {
            value: '💅  style',
            name: '💅  style:    Code Style, Changes that do not affect the meaning of the code'
        },
        {
            value: '⏪  revert',
            name: '⏪  revert:   Revert to a commit'
        }
    ],

    scopes: [],
    allowCustomScopes: true,
    allowBreakingChanges: ['feat', 'fix']
};
