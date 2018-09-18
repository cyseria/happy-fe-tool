#! /usr/bin/env node


/**
 * @file 命令行入口文件
 * @author Cyseria <xcyseria@gmail.com>
 */

const program = require('commander');
const inquirer = require('inquirer');
const pkg = require('../package.json');
const {handleSuccess, handleInfo} = require('./utils/output');
const {tpls} = require('../templates/config');

// 版本信息
program.version(pkg.version, '-v, --version');

// use
program
    .command('add <rules...>')
    .description('add single tool')
    .option('-t, --tpl <tpl>', 'set a template')
    .option('-y, --yes', 'use default template without any question')
    .option('-p, --package', 'set config in package.json, instead of root (file .*rc) ')
    .action(async (rules, cmd) => {
        // TODO: choose rule

        // get config tpl
        // if set options -y, use default
        // if set custom tpl by -t, use custom
        // otherwise, let user choose from config tpls
        const userInput = await inquirer.prompt([
            {
                type: 'list',
                name: 'tpl',
                message: 'choose a template: ',
                choices: Object.keys(tpls), // todo: exsit key
                when() {
                    return !cmd.tpl && !cmd.yes;
                }
            }
        ]);
        let tpl = userInput.tpl || '';
        if (!!cmd.tpl && Object.keys(tpls).includes(cmd.tpl)) {
            tpl = cmd.tpl;
        }
        else if (!!cmd.tpl) {
            handleInfo(
                `can't find ${cmd.tpl} in config, please check and try again. 
 use -y by default config, or use init and follow guide`
            );
        }
        else if (!!cmd.yes) {
            tpl = 'default';
        }

        const ruleConf = tpls[tpl];
        const legalRules = [];
        rules.map(rule => {
            Object.keys(ruleConf).includes(rule) ? legalRules.push(rule) : handleInfo(`no rule "${rule}", skip it...`);
        });
        await Promise.all(
            legalRules.map(rule => {
                const ruleName = rule;
                const ruleContent = ruleConf[rule];
                const curRuleCfg = {name: ruleName, content: ruleContent};
                return require(`./tools/${ruleName}`)(curRuleCfg, tpl);
            })
        );
        handleSuccess(`✨ finish add rules: ${legalRules.join(', ')}`);
    });

// 项目初始化
program
    .command('init [tpl]')
    .description('init project with templates rules')
    .action(async (tpl, options) => {
        const userInput = await inquirer.prompt([
            {
                type: 'list',
                name: 'tpl',
                message: 'choose a template: ',
                choices: Object.keys(tpls), // todo: exsit key
                when() {
                    return !tpl;
                }
            }
        ]);
        tpl = userInput.tpl || tpl;
        if (!Object.keys(tpls).includes(tpl)) {
            handleInfo(`can't find template ${tpl}, please check it and try again...`);
        }

        const template = tpls[tpl];
        const choices = Object.keys(template).map(item => {
            return {
                name: item
            };
        });
        await inquirer
            .prompt([
                {
                    type: 'checkbox',
                    name: 'rules',
                    message: 'Select the rules you want to add: ',
                    choices: choices
                }
            ])
            .then(async answers => {
                await Promise.all(
                    answers.rules.map(rule => {
                        const ruleName = rule;
                        const ruleContent = template[rule];
                        const curRuleCfg = {name: ruleName, content: ruleContent};
                        return require(`./tools/${ruleName}`)(curRuleCfg, tpl);
                    })
                );
                handleSuccess(`✨ finish add rules: ${answers.rules.join(', ')}`);
            });
    });

// remove
program
    .command('remove [rule]')
    .description('remove single tool')
    .action((rule, options) => {
    });

// ls
program
    .command('ls')
    .description('list rules')
    .action((command, options) => {
    });

function getTpl() {
}
program.parse(process.argv);
