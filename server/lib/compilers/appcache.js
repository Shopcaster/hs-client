var compile, exts, fs, getModTime, _;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
_ = require('underscore')._;
fs = require('fs');
require('colors');
exts = ['png', 'jpg', 'gif', 'js', 'ico', 'eot', 'svg'];
compile = function(files, opt, cache, clbk) {
  var manifest, manifestFilename;
  manifestFilename = '/manifest.appcache';
  manifest = '';
  manifest += 'CACHE MANIFEST\n';
  if (!opt.appcache) {
    manifest += 'NETWORK:\n*\n';
    cache[manifestFilename] = manifest;
    return clbk();
  }
  console.log('building appcache'.magenta);
  return getModTime(opt.clientSource, function(err, time) {
    var content, ext, file;
    if (err != null) {
      return clbk(err);
    }
    manifest += "#built: " + time + "\n\n";
    manifest += 'NETWORK:\n*\n\n';
    manifest += 'CACHE:\n';
    for (file in cache) {
      content = cache[file];
      ext = /\.(\w+)$/.exec(file)[1];
      if (__indexOf.call(exts, ext) >= 0 && (!opt.concatJS || ext !== 'js')) {
        manifest += file + '\n';
      }
    }
    if (opt.concatJS) {
      manifest += '/main.js\n';
    }
    cache[manifestFilename] = manifest;
    return clbk();
  });
};
getModTime = function(path, mainClbk) {
  var getTimes, times;
  getTimes = function(path, times, clbk) {
    return fs.stat(path, function(err, stats) {
      if (err != null) {
        return clbk(err);
      }
      if (stats.isDirectory()) {
        return fs.readdir(path, function(err, files) {
          var done, file, _i, _len, _results;
          if (err != null) {
            return clbk(err);
          }
          done = _.after(files.length, clbk);
          _results = [];
          for (_i = 0, _len = files.length; _i < _len; _i++) {
            file = files[_i];
            _results.push(getTimes(path + '/' + file, times, done));
          }
          return _results;
        });
      } else {
        times.push(stats.mtime.getTime());
        return clbk();
      }
    });
  };
  times = [];
  return getTimes(path, times, function(err) {
    if (err != null) {
      return mainClbk(err);
    }
    times.sort(function(a, b) {
      return b - a;
    });
    return mainClbk(null, times[0]);
  });
};
exports.compile = compile;