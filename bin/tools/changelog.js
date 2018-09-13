/**
 * @file
 * @author Cyseria <xcyseria@gmail.com>
 */

const {handleErr, handleInfo} = require('../utils/output');
const {types} = require('../config');
const {
    installPkg,
    editPkg,
    addHooks
} = require('../utils/pkg');
module.exports = async (type, name) => {
    try {
        const config = types[type][name];

        installPkg('conventional-changelog-cli');
        // baidu 规则, 只能内网装
        if (config.name === '@baidu/befe') {
            installPkg('@baidu/conventional-changelog-befe', '', {
                registry: 'http://registry.npm.baidu-int.com'
            });
        }

        editPkg(
            'scripts',
            'changelog',
            `conventional-changelog -p ${config.name} -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md`
        );
        editPkg('scripts', 'version', 'npm run changelogd');
        addHooks(config.hooks, 'npm run changelog');
    }
    catch (err) {
        handleErr(err);
        process.exit(1);
    }
};
