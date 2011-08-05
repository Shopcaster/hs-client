var compile, exts, fs;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
fs = require('fs');
require('colors');
exts = ['png', 'jpg', 'jpeg', 'gif', 'js'];
compile = function(files, opt, cache, clbk) {
  var ext, file, matching, next, _i, _len;
  matching = [];
  for (_i = 0, _len = files.length; _i < _len; _i++) {
    file = files[_i];
    ext = /\.(\w+)$/.exec(file)[1];
    if (__indexOf.call(exts, ext) >= 0) {
      matching.push(file);
    }
  }
  if (matching.length === 0) {
    return clbk();
  }
  console.log('building static'.magenta);
  return (next = function() {
    if (!((file = matching.pop()) != null)) {
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