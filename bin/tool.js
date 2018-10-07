#! /usr/bin/env node


/**
 * @file 命令行入口文件
 * @author Cyseria <xcyseria@gmail.com>
 */

const program = require('commander');
const pkg = require('../package.json');
const {handleSuccess, handleInfo} = require('./utils/output');
const {tpls} = require('../templates/config');
const {
    getTplFromCmd,
    getDirFromCmd,
    getRulesFromTpl
} = require('./utils/inquirer-prompt');
const istallTool = require('./utils/install-tool');

// 版本信息
program.version(pkg.version, '-v, --version');

// use
// TODO: choose rule
program
    .command('add <rules...>')
    .description('add single tool')
    .option('-t, --tpl <tpl>', 'set a template')
    .option('-y, --yes', 'use default template without any question')
    .option('-d, --dir [dir]', 'set config in package.json or custom directory instead of root (file .*rc) ')
    .action(async (rules, cmd) => {
        const tpl = await getTplFromCmd(cmd); // eslint-disable-line
        const dir = await getDirFromCmd(cmd); // eslint-disable-line

        const ruleConf = tpls[tpl];

        // 判断添加的规则是否存在
        const legalRules = [];
        rules.map(rule => {
            Object.keys(ruleConf).includes(rule) ? legalRules.push(rule) : handleInfo(`no rule "${rule}", skip it...`);
        });

        for (const rule of legalRules) {
            const curRuleCfg = {name: rule, content: ruleConf[rule]};
            const {copyOpts, pkgOpts} = await require(`./tools/${rule}`)(curRuleCfg, tpl, dir);
            await istallTool(copyOpts, pkgOpts);
        }
        handleSuccess(`✨ finish add rules: ${legalRules.join(', ')}`);
    });

// 项目初始化
program
    .command('init [tpl]')
    .description('init project with templates rules')
    .option('-d, --dir [dir]', 'set config in package.json or custom directory instead of root (file .*rc) ')
    .action(async (tpl, cmd) => {
        const dir = await getDirFromCmd(cmd); // eslint-disable-line
        tpl = await getTplFromCmd(cmd, tpl);
        const rules = await getRulesFromTpl(tpl);
        const template = tpls[tpl];
        for (const rule of rules) {
            const ruleName = rule;
            const ruleContent = template[rule];
            const curRuleCfg = {name: ruleName, content: ruleContent};
            const {copyOpts, pkgOpts} = await require(`./tools/${ruleName}`)(curRuleCfg, tpl, dir);
            await istallTool(copyOpts, pkgOpts);
        }
        handleSuccess(`✨ finish add rules: ${rules.join(', ')}`);
    });

// remove
program
    .command('remove [rule]')
    .description('remove single tool')
    .action((rule, options) => {
    });

program.parse(process.argv);
