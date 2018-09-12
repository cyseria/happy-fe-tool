/**
 * @file copy file
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

module.exports = async function(source, target) {
    const rd = fs.createReadStream(source);
    const wr = fs.createWriteStream(target);
    try {
        if (fs.existsSync(target)) {
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
        return await new Promise(function(resolve, reject) {
            rd.on('error', reject);
            wr.on('error', reject);
            wr.on('finish', resolve);
            rd.pipe(wr);
        });
    } catch (error) {
        rd.destroy();
        wr.end();
        throw error;
    }
};
