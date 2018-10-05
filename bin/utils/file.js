/**
 * @file
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

exports.writefile = async (path, content) => {
    await checkRepeat(path);
    fs.outputFileSync(path, content);
};

exports.copyfile = async (source, target) => {
    await checkRepeat(target);
    await fs.copy(source, target);
};

async function checkRepeat(target) {
    if (fs.pathExistsSync(target)) {
        const confirm = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'cover',
                message: `文件 ${path.basename(target)} 已存在, 是否覆盖?`
            }
        ]);
        if (!confirm.cover) {
            process.exit(0);
        }
    }
}
