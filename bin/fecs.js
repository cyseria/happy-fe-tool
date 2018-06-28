/**
 * @file fecs 相关
 * @author Cyseria <xcyseria@gmail.com>
 * @created time: 2018-06-28 00:11:52
 * @last modified by: Cyseria
 * @last modified time: 2018-06-28 10:44:48
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const output = require('./utils/output');

let stagedFiles;
module.exports = function (path, source) {
    console.log('\n====== FECS 代码规范 CHECK AND FORMAT ======\n');
    try {
        const fecsRoot = execSync(`which fecs`, {
            encoding: 'utf-8'
        })

        try {
            const result = execSync(`git diff-index --cached --name-only HEAD`, { encoding: 'utf-8' });

            console.log(result.indexOf('Changes not staged for commit'))
            // 还有文件未添加
            if (result.indexOf('Changes not staged for commit') >= 0) {
                console.log('还有文件未添加');
                process.exit(1);
            }

            // console.log('提交的文件列表：');
            // console.log(result)
            // stagedFiles = stagedFiles || result.trim().split('\n');

        } catch (err) {
            if (('' + err).indexOf('unknown revision') > 0) {
                output.handleInfo('仓库还没有提交记录，默认对所有文件进行检查');
                stagedFiles = ['./**/*.{js,css,less,html,vue,styl}']
            }
            else {
                output.handleErr(err);
            }
        }

    } catch (error) {
        output.handleErr('没有安装FECS，请先运行\'npm install fecs -g\'~~');
    }

};

/**
 * 运行代码检查
 * @param  {Array} files 文件列表数组
 */
function fecsCheck(files) {
    // const fecs = require(fecsRoot);
    var options= {
        color: true,
        rule: true,
        stream: false,
        lookup: true,
        level: 0,
        _: files
    };

    var done = function (success, json) {
        success = success && json.length === 0;
        if (!success) {
            console.log('看来规范还有问题，请修改以后再提交吧！');
        }
        console.log('');
        process.exit(success ? 0 : 1);
    };

    fecs.check(options, done);
}