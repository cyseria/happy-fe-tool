/**
 * @file install a tool from some config
 * @author Cyseria <xcyseria@gmail.com>
 */
const path = require('path');
const {installPkg, editPkg} = require('./pkg');
const {writefile, copyfile} = require('./file');

const defaultCopyOpt = {
    // use path.resolve to conect filepath and filename
    sourcePath: '',
    targetPath: process.cwd(),
    filename: '',
    content: ''
};

/**
 * install a tool from some config
 * @param {Array} copyOpts - 需要复制文件的配置, item 参照 defaultCopyOpt
 * @param {Object} pkgOpts - npm package 操作相关
 * @param {Array} packages.install - 需要安装的包
 * @param {{path: Array, content: string}} packages.edit - package.json 需要编辑得字段，调用 pkg.editPkg
 */
module.exports = async (copyOpts, pkgOpts) => {

    /* packages option */
    if (!!pkgOpts) {
        const {install, edit} = pkgOpts;
        for (let i = 0; i < install.length; i++) {
            const opt = install[i];
            if (typeof opt === 'string') {
                await installPkg(opt);
            }
            else {
                const {
                    moduleName,
                    exclusive,
                    config
                } = opt;
                await installPkg(moduleName, exclusive, config);
            }
        }

        for (let i = 0; i < edit.length; i++) {
            const opt = edit[i];
            await editPkg(opt.path, opt.content);
        }
    }

    /* file config option */
    // if has content and targetPath, write file
    // else if has targetPath and sourcepath, copy file
    if (!!copyOpts) {
        for (let i = 0; i < copyOpts.length; i++) {
            const {
                sourcePath,
                targetPath,
                filename,
                content
            } = Object.assign(defaultCopyOpt, copyOpts[i]);
            if (!!content && !!filename) {
                const filepath = path.resolve(targetPath, filename);
                await writefile(filepath, content);
            }
            else if (!!sourcePath) {
                const source = !!filename ? sourcePath : path.resolve(sourcePath, filename);
                const target = !!filename ? targetPath : path.resolve(targetPath, filename);
                await copyfile(source, target);
            }

        }
    }

};
