var build, buildDir, compilers, fs, gzip, listDir, zippit, _;
_ = require('underscore')._;
fs = require('fs');
gzip = require('gzip');
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
zippit = function(cache, clbk) {
  var content, done, name, zipped, _results;
  console.log('performing gzip'.magenta);
  zipped = {};
  done = _.after(Object.keys(cache).length, function() {
    return clbk(null, zipped);
  });
  _results = [];
  for (name in cache) {
    content = cache[name];
    _results.push((function(name, content) {
      return gzip(content, function(err, zipd) {
        if (err !== 0) {
          return clbk(err);
        }
        zipped[name] = zipd;
        return done();
      });
    })(name, content));
  }
  return _results;
};
exports.build = build;
exports.buildDir = buildDir;
exports.gzip = zippit;