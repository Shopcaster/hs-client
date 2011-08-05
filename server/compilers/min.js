var compile, fs, ug;
ug = require('uglify-js');
fs = require('fs');
require('colors');
compile = function(files, opt, cache, clbk) {
  var file, js, next, _i, _len;
  if (!opt.minify) {
    return clbk();
  }
  console.log('uglifying js'.magenta);
  js = {};
  for (_i = 0, _len = cache.length; _i < _len; _i++) {
    file = cache[_i];
    if (/\.coffee$/.test(file)) {
      coff.push(file);
    }
  }
  if (coff.length === 0) {
    return clbk();
  }
  return (next = function() {
    if (!((file = coff.pop()) != null)) {
      return clbk();
    }
    return fs.readFile(file, 'utf8', function(err, content) {
      var name;
      if (err != null) {
        return clbk(err);
      }
      try {
        js = coffee.compile(content);
      } catch (e) {
        return clbk('coffee error in file: ' + file + '\n' + e);
      }
      name = file.replace(opt.src, '').replace(/\.coffee$/, '.js');
      cache[name] = js;
      return next();
    });
  })();
};
exports.compile = compile;