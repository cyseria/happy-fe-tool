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
    getToolsFromTpl
} = require('./utils/inquirer-prompt');
const istallTool = require('./utils/install-tool');
const {addExtraEditPkg} = require('./utils/pkg');

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
            addExtraEditPkg(optsConfig.extraConfig);
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
        const tplname = await getTplFromCmd(cmd, tpl);
        const toolsList = await getToolsFromTpl(tplname);
        const tplConfig = tpls[tplname];
        const tools = tplConfig.tools || {};
        const optsConfig = tplConfig.options || {};
        optsConfig.configDir = await getDirFromCmd(cmd.dir, optsConfig.defaultConfigDir || ''); // eslint-disable-line

        for (const toolName of toolsList) {
            const toolContent = tools[toolName];
            const curRuleCfg = {name: toolName, content: toolContent};
            const {copyOpts, pkgOpts} = await require(`./tools/${toolName}`)(curRuleCfg, tpl, optsConfig);
            addExtraEditPkg(optsConfig.extraConfig);
            await istallTool(copyOpts, pkgOpts);
        }
        handleSuccess(`✨ finish add rules: ${toolsList.join(', ')}`);
    });

// remove
program
    .command('remove [rule]')
    .description('remove single tool')
    .action((rule, options) => {
    });

program.parse(process.argv);
