/**
 * @file
 * @author Cyseria <xcyseria@gmail.com>
 */

const {handleErr, handleInfo} = require('../utils/output');
const {types} = require('../config');
const {installPkg, editPkg, addHooks} = require('../utils/pkg');
module.exports = async (type, name) => {
    try {
        const config = types[type][name];

        installPkg('conventional-changelog-cli');

        let presetName = '';
        if (typeof config.preset === 'string') {
            presetName = config.preset;
        } else if (Object.prototype.toString.call(config.preset) === '[object Object]') {
            const configPreset = config.preset;
            presetName = configPreset[name];
            if (!!configPreset.dependency) {
                installPkg(configPreset.dependency, '', {
                    registry: configPreset.registry || ''
                });
            }
        }

        editPkg(
            'scripts',
            'changelog',
            `conventional-changelog -p ${presetName} -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md`
        );
        editPkg('scripts', 'version', 'npm run changelogd');
        addHooks(config.hooks, 'npm run changelog');
    } catch (err) {
        handleErr(err);
        process.exit(1);
    }
};
