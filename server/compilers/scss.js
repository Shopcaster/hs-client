var compile, exec;
exec = require('child_process').exec;
compile = function(files, opt, cache, clbk) {
  var file, next, scss;
  scss = [];
  if ((function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      _results.push(/\.scss$/.test(file));
    }
    return _results;
  })()) {
    scss.push(file);
  }
  if (scss.length = 0) {
    return clbk();
  }
  return (next = function() {
    if (!((file = scss.pop()) != null)) {
      return clbk();
    }
    return exec("sass " + file, function(err, stdout, stderr) {
      if (err != null) {
        return clbk(err);
      }
      cache[file.replace(opt.src, '')] = stdout;
      return next();
    });
  })();
};
exports.compile = compile;