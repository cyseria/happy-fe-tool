const path = require('path');

exports.getSourcePath = (tplname, filename) => {
    return path.resolve(process.cwd(), './templates', tplname, filename);
};

exports.getRootTargetPath = filename => {
    return path.resolve(process.cwd(), filename);
};
