const changelog = require('../../bin/tools/changelog');

describe('changelog test', () => {
    it('should add changelog script in package.json with moyuy husky', async () => {
        const rule = {
            name: 'changelog',
            content: {
                preset: 'angular'
            }
        };
        const {pkgOpts} = await changelog(rule);
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

    it('should add changelog script in package.json with moyuy husky', async () => {
        const rule = {
            name: 'changelog',
            content: {
                preset: {
                    name: '@baidu/befe',
                    dependency: '@baidu/conventional-changelog-befe',
                    registry: 'http://registry.npm.baidu-int.com'
                },
                hooks: 'pre-push',
                moyuycHusky: true
            }
        };
        const {pkgOpts} = await changelog(rule);
        const {install, edit} = pkgOpts;

        expect(install).toEqual(
            expect.arrayContaining([
                'conventional-changelog-cli',
                '@moyuyc/husky',
                {
                    moduleName: rule.content.preset.dependency,
                    config: {
                        registry: rule.content.preset.registry
                    }
                }
            ])
        );
        expect(edit).toEqual(
            expect.arrayContaining([
                {
                    path: ['scripts', 'changelog'],
                    content: `conventional-changelog -p ${
                    rule.content.preset.name
                    } -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md`
                },
                {path: ['scripts', 'version'], content: 'npm run changelog'},
                {path: ['husky', 'installType'], content: 'append'},
                {path: ['husky', 'hooks', 'pre-push'], content: 'npm run changelog'}
            ])
        );
    });
});
