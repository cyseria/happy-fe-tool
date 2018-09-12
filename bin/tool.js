#! /usr/bin/env node

/**
 * @file 命令行入口文件
 * @author Cyseria <xcyseria@gmail.com>
 */

const program = require('commander');
const inquirer = require('inquirer');
const pkg = require('../package.json');
const output = require('./utils/output');
const {ruleTmp, types} = require('./config');

// 版本信息
program.version(pkg.version, '-v, --version');

// use
program
    .command('add [conf...]')
    .description('add single tool')
    .action(async conf => {
        // get rule name
        const name = conf[0];
        const userInputName = await inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'choose a rule: ',
                choices: Object.keys(ruleTmp),
                when() {
                    return !name;
                }
            }
        ]);
        const ruleName = userInputName.name || name;

        // get rule type
        const ruleTypes = Object.keys(types).filter(item => {
            return Object.prototype.hasOwnProperty.call(types[item], ruleName);
        });
        const type = conf[1];
        const userInputType = await inquirer.prompt([
            {
                type: 'list',
                name: 'type',
                message: 'choose a type: ',
                choices: ruleTypes,
                when() {
                    return !type;
                }
            }
        ]);
        const ruleType = userInputType.type || type;
        if (Object.keys(ruleTmp).includes(ruleName) && Object.keys(types).includes(ruleType)) {
            const config = types[ruleType][ruleName];
            require(`./tools/${ruleName}`)(config);
        } else {
            output.handleErr('no such rules, please check it and try again...');
        }
    });

// remove
program
    .command('remove [rule]')
    .description('remove single tool')
    .action(function(rule, options) {});

// ls
program
    .command('ls')
    .description('list rules')
    .action(function(command, options) {});

// 项目初始化
program
    .command('lint [rules]')
    .description('fecs git hook')
    .action(function(rules, options) {
        if (!!rules) {
            // default use bd
            console.log('use ' + conf);
        }
    });

program.parse(process.argv);
