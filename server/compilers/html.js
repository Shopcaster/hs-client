var compile, depends, fs;
fs = require('fs');
depends = require('depends');
require('colors');
compile = function(files, opt, cache, clbk) {
  var f, file, _i, _len;
  file = null;
  for (_i = 0, _len = files.length; _i < _len; _i++) {
    f = files[_i];
    if (/\.html$/.test(f)) {
      file = f;
      break;
    }
  }
  if (!(file != null)) {
    return clbk();
  }
  console.log('building html'.magenta);
  return fs.readFile(file, 'utf8', function(err, html) {
    var content, file, scripts;
    if (err != null) {
      return clbk(err);
    }
    html = html.replace('</head>', '<script>var conf=' + JSON.stringify(opt.conf) + ';</script></head>');
    if (!opt['noappcache']) {
      html = html.replace('<html', "<html manifest='/manifest.appcache'");
    }
    html = html.replace('</head>', "<link rel='stylesheet' href='/style.css'></head>");
    html = html.replace('</body>', "<script src='" + opt.conf.zz.server.protocol + "://" + opt.conf.zz.server.host + ":" + opt.conf.zz.server.port + "/api-library.js'></script></body>");
    scripts = '';
    files = new depends.Files();
    files.js = {};
    for (file in cache) {
      content = cache[file];
      if (/\.js$/.test(file)) {
        files.js[file] = content;
      }
    }
    return files.getClient(false, function(err, content) {
      var file, _j, _len2, _ref;
      if (err != null) {
        return clbk(err);
      }
      scripts += '<script src="/loader.js"></script>';
      cache['/loader.js'] = content;
      _ref = files.output;
      for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
        file = _ref[_j];
        scripts += "<script src='" + file + "'></script>";
      }
      html = html.replace('</body>', scripts + '</body>');
      cache['/index.html'] = html;
      return clbk();
    });
  });
};
exports.compile = compile;