/**
 * @file copy from fecs-git-hook
 * @author Cyseria <xcyseria@gmail.com>
 * @created time: 2018-07-01 18:28:34
 * @last modified by: Cyseria
 * @last modified time: 2018-07-01 18:31:57
 */

const Path = require('path');
const Fs = require('fs');

/* eslint-disable no-console */

const internals = {};

// Expands source and target to absolute paths, then calls internals.copy
exports.copy = function (source, target, options) {

    if (typeof target === 'object') {
        options = target;
        target = undefined;
    }

    options = options || {};

    const root = Path.dirname(internals.findParent(module).filename);
    const projectRoot = exports.findGitRoot(root);

    const sourcePath = Path.resolve(root, source);
    const targetPath = Path.resolve(projectRoot, target || source);

    if (targetPath.indexOf(projectRoot) !== 0) {
        throw new Error('Destination must be within project root');
    }

    return internals.copy(sourcePath, targetPath, options);
};

// Install the git hook as specified by `hook`.
// For example, Validate.installHook('pre-commit');
exports.installHooks = function (hooks, root) {
    hooks = Array.isArray(hooks) ? hooks : [hooks];
    const gitRoot = exports.findGitRoot(root);
    const hookRoot = Path.join(gitRoot, '.git', 'hooks');

    const source = Path.resolve(__dirname, '..', 'hooks', 'pre-commit');

    if (!exports.isDir(hookRoot)) {
        internals.mkdir(hookRoot);
    }

    for (let i = 0, il = hooks.length; i < il; ++i) {
        const hook = hooks[i];
        const dest = Path.join(hookRoot, hook);

        if (Fs.existsSync(dest)) {
            Fs.renameSync(dest, dest + '.backup');
        }

        Fs.writeFileSync(dest, Fs.readFileSync(source), { mode: 511 });
    }
};

exports.unInstallHooks = function (hooks, root) {

    hooks = Array.isArray(hooks) ? hooks : [hooks];
    const gitRoot = exports.findGitRoot(root);
    const hookRoot = Path.join(gitRoot, '.git', 'hooks');

    if (!exports.isDir(hookRoot)) {
        return;
    }

    for (let i = 0, il = hooks.length; i < il; ++i) {
        const hook = hooks[i];
        const dest = Path.join(hookRoot, hook);

        if (Fs.existsSync(dest)) {
            Fs.unlinkSync(dest);

            if (Fs.existsSync(dest + '.backup')) {
                Fs.renameSync(dest + '.backup', dest);
            }
        }
    }

};


// Given a starting directory, find the root of a git repository.
// In this case, the root is defined as the first directory that contains
// a directory named ".git"
//
// Returns a string if found, otherwise undefined
exports.findGitRoot = function (start) {

    start = start || Path.dirname(internals.findParent(module).filename);
    let root;

    if (exports.isDir(Path.join(start, '.git'))) {
        root = start;
    }
    /* $lab:coverage:off$ */
    // Coverage disabled here due to false positive on else if, since we have to trap the throwWarn method
    else if (Path.dirname(start) !== start) {
        root = exports.findGitRoot(Path.dirname(start));
    }
    else {
        return internals.throwWarn('Unable to find a .git directory for this project');
    }
    /* $lab:coverage:on$ */

    return root;
};


/* $lab:coverage:off$ */
// Coverage disabled for this method because we use a child process to test it due to the process.exit() call
internals.throwWarn = function (warning) {

    console.error('WARNING: ' + warning + ', installation aborted.');
    process.exit(0);
};
/* $lab:coverage:on$ */

// Find the topmost parent of the given module.
internals.findParent = function (mod) {

    return mod.parent ? internals.findParent(mod.parent) : mod;
};


// Similar to mkdir -p, recursively creates directories until `path` exists
internals.mkdir = function (path) {

    const mode = ~process.umask() & parseInt('777', 8);

    if (exports.isDir(path)) {
        return;
    }

    try {
        Fs.mkdirSync(path, mode);
    }
    catch (err) {
        if (err.code !== 'ENOENT') {
            throw err;
        }

        internals.mkdir(Path.dirname(path));
        internals.mkdir(path);
    }
};


// Determine if source is a directory or a file and call the appropriate method
internals.copy = function (source, target, options) {

    if (exports.isDir(source)) {
        internals.copyDirectory(source, target, options);
    }
    else {
        return internals.copyFile(source, target, options);
    }
};

// Copy a single file
internals.copyFile = function (source, target, options) {

    internals.mkdir(Path.dirname(target));

    const mode = ~process.umask() & parseInt('666', 8);

    if (Fs.existsSync(target)
        && !options.overwrite) {

        return new Error(target + ' already exists');
    }

    const sourceContent = '';
    try {
        sourceContent = Fs.readFileSync(source);
    }
    catch (e) {
        /* no source to copy */
    }

    Fs.writeFileSync(target, sourceContent, { flag: 'w', mode: mode });
};

// Recursively copy a directory
internals.copyDirectory = function (source, target, options) {
    internals.mkdir(target);
    const sources = Fs.readdirSync(source);
    for (let i = 0, l = sources.length; i < l; ++i) {
        const sourcePath = Path.join(source, sources[i]);
        const targetPath = Path.join(target, sources[i]);

        internals.copy(sourcePath, targetPath, options);
    }
};


// Given a path, determine if the path is a directory
exports.isDir = function (path) {

    try {
        const stat = Fs.statSync(path);
        return stat.isDirectory();
    }
    catch (e) {
        return false;
    }
};