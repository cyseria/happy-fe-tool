/**
 * @file Node Version Manager, see https://github.com/creationix/nvm
 * @author Cyseria <xcyseria@gmail.com>
 */

const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const {handleErr, handleInfo} = require('../utils/output');

module.exports = async (type, name) => {
    try {
        // use current node version
        const configFileName = '.nvmrc';
        const {stdout} = await execa.shell('node -v');

        const file = path.resolve(process.cwd(), configFileName);
        fs.outputFileSync(file, stdout);
    }
    catch (err) {
        handleErr(err);
        process.exit(1);
    }
};
