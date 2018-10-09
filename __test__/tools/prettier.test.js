/**
 * @file prettier test
 * @author Cyseria <xcyseria@gmail.com>
 */

const path = require('path');
const prettier = require('../../bin/tools/prettier');

describe('prettier test', () => {
    const sourcePath = path.resolve(process.cwd(), './templates', 'baidu', '.prettierrc');
    const targetPath = path.resolve(process.cwd(), '.prettierrc');

    it('should copy prettierrc to root dir', async () => {
        const ruleCfg = {name: 'prettier', content: '.prettierrc'};
        const tplName = 'baidu';
        const expectCopyOptsReturn = {
            sourcePath: sourcePath,
            targetPath: targetPath
        };
        const expectPkgOptsReturn = {install: [], edit: []};
        const realResult = await prettier(ruleCfg, tplName);

        expect(realResult.copyOpts[0]).toEqual(expectCopyOptsReturn);
        expect(realResult.pkgOpts).toEqual(expectPkgOptsReturn);
    });

    it('should set prettierrc to package.json', async () => {
        const ruleCfg = {name: 'prettier', content: '.prettierrc'};
        const tplName = 'baidu';
        const opts = {
            configDir: '/Users/aaa/code/demo/happy-test/happy-config'
        };
        const realResult = await prettier(ruleCfg, tplName, opts);
        const expectPkgEditReturn = {
            install: [],
            edit: [{
                path: ['prettier'],
                content: expect.any(Object)
            }]
        };
        expect(realResult.pkgOpts).toEqual(expect.objectContaining(expectPkgEditReturn));
    });
});
