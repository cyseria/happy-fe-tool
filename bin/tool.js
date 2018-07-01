#! /usr/bin/env node

/**
 * @file 命令行入口文件
 * @author Cyseria <xcyseria@gmail.com>
 * @created time: 2018-06-28 00:07:40
 * @last modified by: Cyseria
 * @last modified time: 2018-07-01 18:41:58
 */

const program = require('commander');
const pkg = require('../package.json');

// 版本信息
program.version(pkg.version, '-v, --version');

// 项目初始化
program
    .command('fecs-hook [command]')
    .description('fecs git hook')
    .option('-l, --level [mode]', 'Which level  to use')
    .action(function (command, options) {
        const level = options.level || 2;
        require('./fecs')(command, level);
    });

program.parse(process.argv);
