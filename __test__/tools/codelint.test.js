/**
 * @file codelint test
 * @author Cyseria <xcyseria@gmail.com>
 */

const path = require('path');
const {getSourcePath, getRootTargetPath} = require('../helper/getpath');
const codelint = require('../../bin/tools/codelint');

describe('codelint test', () => {
    const tplName = 'baidu';
    const dir = path.resolve(process.cwd(), 'happy-config');

    it('should copy fecs config to root dir', async () => {
        const rule = {
            name: 'codelint',
            content: {
                lintTool: 'fecs',
                lintConfigFile: '.fecsrc'
            }
        };
        const realResult = await codelint(rule, tplName);
        const edit = realResult.pkgOpts.edit[0];
        expect(realResult.copyOpts).toEqual([
            {
                sourcePath: getSourcePath(tplName, '.fecsrc'),
                targetPath: getRootTargetPath('.fecsrc')
            }
        ]);
        expect(realResult.pkgOpts.install).toEqual(['fecs']);
        expect(edit.path).toEqual(['scripts', 'lint']);
        expect(edit.content).toContain('fecs');
    });

    it('should copy fecs and lint-stage config to root dir with hooks', async () => {
        const rule = {
            name: 'codelint',
            content: {
                lintTool: 'fecs',
                lintConfigFile: '.fecsrc',
                lintStagedConfigFile: '.lintstagedrc',
                hooks: 'pre-commit',
                moyuycHusky: true
            }
        };
        const realResult = await codelint(rule, tplName);
        const {install, edit} = realResult.pkgOpts;

        expect(realResult.copyOpts).toEqual([
            {
                sourcePath: getSourcePath(tplName, '.fecsrc'),
                targetPath: getRootTargetPath('.fecsrc')
            },
            {
                sourcePath: getSourcePath(tplName, '.lintstagedrc'),
                targetPath: getRootTargetPath('.lintstagedrc')
            }
        ]);

        expect(install).toEqual(['fecs', '@moyuyc/husky', 'lint-staged']);
        expect(edit.length).toBe(3);
    });

    it('should copy fecs config to package.json', async () => {
        const rule = {
            name: 'codelint',
            content: {
                lintTool: 'fecs',
                lintConfigFile: '.fecsrc'
            }
        };
        const realResult = await codelint(rule, tplName, dir);
        const {install, edit} = realResult.pkgOpts;
        expect(install).toEqual(['fecs']);
        expect(edit[0].path).toEqual(expect.arrayContaining(['scripts', 'lint']));
        expect(edit[1].path).toEqual(expect.arrayContaining(['fecs']));
    });
});
