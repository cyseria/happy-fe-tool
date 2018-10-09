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

// add
// TODO: choose rule
program
    .command('add <tools...>')
    .description('add single tool')
    .option('-t, --tpl <tpl>', 'set a template')
    .option('-y, --yes', 'use default template without any question')
    .option('-d, --dir [dir]', 'set config in package.json or custom directory instead of root (file .*rc) ')
    .action(async (tools, cmd) => {
        const tplname = await getTplFromCmd(cmd); // eslint-disable-line

        const tplConfig = tpls[tplname];

        const optsConfig = tplConfig.options || {};
        optsConfig.configDir = await getDirFromCmd(cmd.dir, optsConfig.defaultConfigDir || ''); // eslint-disable-line

        const toolConfig = tplConfig.tools;

        // 判断添加的规则是否存在
        const legalTools = [];
        tools.map(tool => {
            Object.keys(tplConfig.tools).includes(tool)
                ? legalTools.push(tool)
                : handleInfo(`no tool "${tool}", skip it...`);
        });

        for (const tool of legalTools) {
            const curToolConfig = {name: tool, content: toolConfig[tool]};
            const {copyOpts, pkgOpts} = await require(`./tools/${tool}`)(curToolConfig, tplname, optsConfig);
            await istallTool(copyOpts, pkgOpts);
        }
        handleSuccess(`✨ finish add tools: ${legalTools.join(', ')}`);
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
