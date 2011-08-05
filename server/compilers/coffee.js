var coffee, compile, fs;
coffee = require('coffee-script');
fs = require('fs');
compile = function(files, opt, cache, clbk) {
  var file, next;
  coffee = [];
  if ((function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      _results.push(/\.coffee$/.test(file));
    }
    return _results;
  })()) {
    coffee.push(file);
  }
  if (coffee.length = 0) {
    return clbk();
  }
  return (next = function() {
    if (!((file = coffee.pop()) != null)) {
      return clbk();
    }
    return fs.readFile(file, 'utf8', function(err, content) {
      var js;
      if (err != null) {
        return clbk(err);
      }
      try {
        js = coffee.compile(content);
      } catch (e) {
        return clbk(e);
      }
      cache[file.replace(opt.src, '')] = js;
      return next();
    });
  })();
};
exports.compile = compile;