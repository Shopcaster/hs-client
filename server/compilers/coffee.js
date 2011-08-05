var coffee, compile, fs;
coffee = require('coffee-script');
fs = require('fs');
require('colors');
compile = function(files, opt, cache, clbk) {
  var coff, file, next, _i, _len;
  coff = [];
  for (_i = 0, _len = files.length; _i < _len; _i++) {
    file = files[_i];
    if (/\.coffee$/.test(file)) {
      coff.push(file);
    }
  }
  if (coff.length === 0) {
    return clbk();
  }
  console.log('building coffee'.magenta);
  return (next = function() {
    if (!((file = coff.pop()) != null)) {
      return clbk();
    }
    return fs.readFile(file, 'utf8', function(err, content) {
      var js, name;
      if (err != null) {
        return clbk(err);
      }
      try {
        js = coffee.compile(content);
      } catch (e) {
        return clbk(e);
      }
      name = file.replace(opt.src, '').replace(/\.coffee$/, '.js');
      cache[name] = js;
      return next();
    });
  })();
};
exports.compile = compile;