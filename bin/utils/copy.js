/**
 * @file copy
 * @author Cyseria <xcyseria@gmail.com>
 */

module.exports = function() {
  return new Promise(resolve => {
    const read = fs.createReadStream(source);
    source.on("error", err => {
      throw err;
    });

    const write = fs.createWriteStream(to);
    write.on("error", err => {
      throw err;
    });
    write.on("finish", () => {
      resolve();
    });

    read.pipe(write);
  });
};
