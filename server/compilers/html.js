var compile, depends, fs;
fs = require('fs');
depends = require('depends');
compile = function(files, opt, cache, clbk) {
  var f, file;
  if ((function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      f = files[_i];
      _results.push(/\.html$/.test(f));
    }
    return _results;
  })()) {
    file = f;
  }
  if (!(file != null)) {
    return clbk();
  }
  return fs.readFile(file, 'utf8', function(err, html) {
    var content, file, manifest, manifestFilename, scripts, stamp;
    if (err != null) {
      return clbk(err);
    }
    html.replace('</head>', JSON.stringify(opt.conf) + '</head>');
    manifestFilename = '/manifest.appcache';
    manifest = '';
    manifest += 'CACHE MANIFEST\n';
    stamp = Math.round(new Date().getTime() / 1000);
    manifest += "#built: " + stamp + "\n\n";
    manifest += 'NETWORK:\n*\n\n';
    if (!opt['noappcache']) {
      manifest += 'CACHE:\n';
      for (file in cache) {
        content = cache[file];
        minifest += file(+'\n');
      }
    }
    cache[manifestFilename] = manifest;
    html.replace('<html', "<html manifest='" + manifestFilename + "'");
    html.replace('</body>', "<script src='" + opt.conf.zz.server.protocol + "://" + opt.conf.zz.server.host + ":" + opt.conf.zz.server.port + "/api-library.js'></script></body>");
    scripts = '';
    files = new depends.Files();
    files.js = {};
    if ((function() {
      var _results;
      _results = [];
      for (file in cache) {
        content = cache[file];
        _results.push(/\.js$/.test(file));
      }
      return _results;
    })()) {
      files.js[file] = content;
    }
    return files.getClient(false, function(err, content) {
      var file, _i, _len, _ref;
      if (err != null) {
        return clbk(err);
      }
      scripts += '<script src="/loader.js"></script>';
      cache['/loader.js'] = content;
      _ref = files.output;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        scripts += '<script src="/#{file}"></script>';
      }
      html.replace('</body>', scripts + '</body>');
      cache['/index.html'] = html;
      return clbk();
    });
  });
};
exports.compile = compile;