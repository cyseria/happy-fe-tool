/**
 * @file nvm test
 * @author Cyseria <xcyseria@gmail.com>
 */

const nvm = require('../../bin/tools/nvm');
describe('nvm test', () => {
    it('should use current node version', async () => {
        const ruleCfg = {name: 'nvm', content: ''};
        const expectReturn = {
            copyOpts: [{
                filename: '.nvmrc',
                content: process.version
            }]
        };
        expect(nvm(ruleCfg)).toEqual(expectReturn);
    });
    it('should use config node version', async () => {
        const ruleCfg = {name: 'nvm', content: 'v10.0.0'};
        const expectReturn = {
            copyOpts: [{
                filename: '.nvmrc',
                content: 'v10.0.0'
            }]
        };
        expect(nvm(ruleCfg)).toEqual(expectReturn);
    });
});
