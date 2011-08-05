var compile, fs, getModTime, _;
_ = require('underscore')._;
fs = require('fs');
require('colors');
compile = function(files, opt, cache, clbk) {
  var manifest, manifestFilename;
  manifestFilename = '/manifest.appcache';
  manifest = '';
  manifest += 'CACHE MANIFEST\n';
  if (opt.noappcache) {
    manifest += 'NETWORK:\n*\n';
    cache[manifestFilename] = manifest;
    return clbk();
  }
  console.log('building appcache'.magenta);
  return getModTime(opt.src, function(err, time) {
    var content, file;
    if (err != null) {
      return clbk(err);
    }
    manifest += "#built: " + time + "\n\n";
    manifest += 'NETWORK:\n*\n\n';
    manifest += 'CACHE:\n';
    for (file in cache) {
      content = cache[file];
      manifest += file + '\n';
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