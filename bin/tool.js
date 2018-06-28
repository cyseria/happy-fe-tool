#! /usr/bin/env node

/**
 * @file 命令行入口文件
 * @author Cyseria <xcyseria@gmail.com>
 * @created time: 2018-06-28 00:07:40
 * @last modified by: Cyseria
 * @last modified time: 2018-06-28 00:28:04
 */

const program = require('commander');
const pkg = require('../package.json');

// 版本信息
program.version(pkg.version, '-v, --version');

// 项目初始化
program
    .command('fecs-hook [command]')
    .description('fecs git hook')
    .option('-l, --level')
    .action(function (command) {
        console.log(command)
        require('./fecs')(command);
    });

program.parse(process.argv);