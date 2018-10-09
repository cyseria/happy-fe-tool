const changelog = require('../../bin/tools/changelog');

describe('changelog test', () => {
    it('should add changelog script in package.json without moyuy husky', async () => {
        const toolConfig = {
            name: 'changelog',
            content: {
                preset: 'angular'
            }
        };
        const opts = {
            moyuycHusky: false
        };
        const {pkgOpts} = await changelog(toolConfig, 'baidu', opts);
        const {install, edit} = pkgOpts;

        expect(install).toEqual(expect.arrayContaining(['conventional-changelog-cli']));
        expect(edit).toEqual(
            expect.arrayContaining([
                {
                    path: ['scripts', 'changelog'],
                    content: 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md'
                },
                {path: ['scripts', 'version'], content: 'npm run changelog'}
            ])
        );
    });

    it('should add changelog script in package.json with moyuy husky and single hooks', async () => {
        const toolConfig = {
            name: 'changelog',
            content: {
                preset: {
                    name: '@baidu/befe',
                    dependency: '@baidu/conventional-changelog-befe',
                    registry: 'http://registry.npm.baidu-int.com'
                },
                hooks: 'pre-push'
            }
        };
        const opts = {
            moyuycHusky: true
        };
        const {pkgOpts} = await changelog(toolConfig, 'baidu', opts);
        const {install, edit} = pkgOpts;

        expect(install).toEqual(
            expect.arrayContaining([
                'conventional-changelog-cli',
                '@moyuyc/husky',
                {
                    moduleName: toolConfig.content.preset.dependency,
                    config: {
                        registry: toolConfig.content.preset.registry
                    }
                }
            ])
        );
        expect(edit).toEqual(
            expect.arrayContaining([
                {
                    path: ['scripts', 'changelog'],
                    content: `conventional-changelog -p ${
                    toolConfig.content.preset.name
                    } -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md`
                },
                {path: ['scripts', 'version'], content: 'npm run changelog'},
                {path: ['husky', 'installType'], content: 'append'},
                {path: ['husky', 'hooks', 'pre-push'], content: 'npm run changelog'}
            ])
        );
    });

    it('should add changelog script in package.json with moyuy husky and single hooks', async () => {
        const toolConfig = {
            name: 'changelog',
            content: {
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
        };
        const {pkgOpts} = await changelog(toolConfig, 'baidu', {
            moyuycHusky: true
        });
        const {edit} = pkgOpts;

        expect(edit).toEqual(
            expect.arrayContaining([
                {path: ['husky', 'hooks', 'pre-push'], content: 'npm run changelog'},
                {path: ['husky', 'hooks', 'commit-msg'], content: 'tranz $HUSKY_GIT_PARAMS --write'}
            ])
        );
    });
});
