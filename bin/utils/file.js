/**
 * @file
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs-extra');
const {confirmFileCover} = require('./inquirer-prompt');

exports.writefile = async (path, content) => {
    const iscover = await checkRepeat(path);
    if (iscover) {
        fs.outputFileSync(path, content);
    }

};

exports.copyfile = async (source, target) => {
    const iscover = await checkRepeat(target);
    if (iscover) {
        await fs.copy(source, target);
    }

};

async function checkRepeat(target) {
    if (!fs.pathExistsSync(target)) {
        return true;
    }

    return await confirmFileCover(target);
}
