const path = require('path');
const {getSourcePath, getRootTargetPath} = require('../helper/getpath');
const commitizen = require('../../bin/tools/commitizen');

describe('commitizen test', () => {
    const tplName = 'baidu';
    const toolConfig = {name: 'commitizen', content: 'cz-customizable'};
    const opts = {};

    it('should copy cz-config to root dir', async () => {
        const realResult = await commitizen(toolConfig, tplName, opts);
        expect(realResult.copyOpts).toEqual([
            {
                sourcePath: getSourcePath(tplName, '.czrc'),
                targetPath: getRootTargetPath('.czrc')
            },
            {
                sourcePath: getSourcePath(tplName, '.cz-config.js'),
                targetPath: getRootTargetPath('.cz-config.js')
            }
        ]);
        const {install, edit} = realResult.pkgOpts;
        expect(install).toEqual(['commitizen', 'cz-customizable']);
        expect(edit[0].path).toEqual(['scripts', 'commit']);
        expect(edit[0].content).toContain('git-cz');
    });

    it('should copy cz-config config to package.json and default dir', async () => {
        const opts = {
            configDir: path.resolve(process.cwd(), 'happy-config')
        };
        const realResult = await commitizen(toolConfig, tplName, opts);
        const {edit} = realResult.pkgOpts;
        expect(realResult.copyOpts).toEqual([
            {},
            {
                sourcePath: getSourcePath(tplName, '.cz-config.js'),
                targetPath: getRootTargetPath('./happy-config/.cz-config.js')
            }
        ]);

        expect(edit).toEqual([
            {
                path: ['config', 'commitizen', 'path'],
                content: './node_modules/cz-customizable'
            },
            {
                path: ['config', 'cz-customizable', 'config'],
                content: 'happy-config/.cz-config.js'
            },
            {path: ['scripts', 'commit'], content: 'git-cz'}
        ]);
    });

    it('should copy cz-config config to custom dir', async () => {
        const opts = {
            configDir: path.resolve(process.cwd(), 'custom-config')
        };
        const realResult = await commitizen(toolConfig, tplName, opts);
        const {edit} = realResult.pkgOpts;
        expect(realResult.copyOpts).toEqual([
            {},
            {
                sourcePath: getSourcePath(tplName, '.cz-config.js'),
                targetPath: getRootTargetPath('./custom-config/.cz-config.js')
            }
        ]);

        expect(edit).toEqual([
            {
                path: ['config', 'commitizen', 'path'],
                content: './node_modules/cz-customizable'
            },
            {
                path: ['config', 'cz-customizable', 'config'],
                content: 'custom-config/.cz-config.js'
            },
            {path: ['scripts', 'commit'], content: 'git-cz'}
        ]);
    });
});
