var compile, fs;
fs = require('fs');
compile = function(files, opt, cache, clbk) {
  var ext, file, img, next, _i, _len;
  img = [];
  for (_i = 0, _len = files.length; _i < _len; _i++) {
    file = files[_i];
    ext = /\.(\w+)$/.exec(file)[1];
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif') {
      img.push(file);
    }
  }
  return (next = function() {
    if (!((file = img.pop()) != null)) {
      return clbk();
    }
    return fs.readFile(file, function(err, content) {
      if (err != null) {
        return clbk(err);
      }
      cache[file.replace(opt.src, '')] = content;
      return next();
    });
  })();
};
exports.compile = compile;