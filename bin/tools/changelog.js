/**
 * @file
 * @author Cyseria <xcyseria@gmail.com>
 */

const {handleErr, handleInfo} = require('../utils/output');
module.exports = async (type, name) => {
    try {
        console.log();
    }
    catch (err) {
        handleErr(err);
        process.exit(1);
    }
};
