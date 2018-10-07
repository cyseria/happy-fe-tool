const execa = require('execa');
const {join} = require('path');
const pkg = require('../package.json');
const file = join(__dirname, '../bin/tool.js');

const exec = async args => {
    const {stdout} = await execa(file, args);
    return stdout;
};

describe('main cli test', () => {
    it('should `-v` works', async () => {
        const stdout = await exec(['-h']);
        expect(stdout).toEqual(expect.stringContaining('Usage'));
    });

    it('should `-h` works', async () => {
        const stdout = await exec(['-v']);
        expect(stdout).toEqual(expect.stringContaining(pkg.version));
    });
});
