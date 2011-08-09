var build, buildDir, compilers, fs, listDir, _;
_ = require('underscore')._;
fs = require('fs');
compilers = [require('./compilers/coffee'), require('./compilers/scss'), require('./compilers/static'), require('./compilers/min'), require('./compilers/appcache'), require('./compilers/html')];
build = function(files, opt, cache, clbk) {
  var comps, next;
  comps = _.clone(compilers);
  return (next = function(err) {
    var compiler;
    if (err != null) {
      return clbk(err);
    }
    if (!(compiler = comps.shift())) {
      return clbk();
    }
    return compiler.compile(files, opt, cache, next);
  })();
};
buildDir = function(dir, opt, cache, clbk) {
  return listDir(dir, function(err, files) {
    if (err != null) {
      return clbk(err);
    }
    return build(files, opt, cache, clbk);
  });
};
listDir = function(dir, clbk) {
  var result;
  result = [];
  return fs.readdir(dir, function(err, files) {
    var next;
    if (err != null) {
      return clbk(err);
    }
    return (next = function(err) {
      var file;
      if (err != null) {
        return clbk(err);
      }
      if (!(file = files.pop())) {
        return clbk(null, result);
      }
      file = dir + '/' + file;
      return fs.stat(file, function(err, stat) {
        if (err != null) {
          return clbk(err);
        }
        if (stat.isDirectory()) {
          return listDir(file, function(err, subResult) {
            if (err != null) {
              return clbk(err);
            }
            result = result.concat(subResult);
            return next();
          });
        } else {
          result.push(file);
          return next();
        }
      });
    })();
  });
};
exports.build = build;
exports.buildDir = buildDir;