/**
 * @file prettier.js
 * @author Cyseria <xcyseria@gmail.com>
 */

const {handleErr, handleInfo} = require("../utils/output");
module.exports = async function (config) {
    try {
        console.log()
    } catch (err) {
        handleErr(err);
        process.exit(1);
    }
};