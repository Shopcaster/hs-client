var compile, crypto, depends, fs;
crypto = require('crypto');
fs = require('fs');
depends = require('depends');
require('colors');
compile = function(files, opt, cache, clbk) {
  var f, file, hash, _i, _len;
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
  hash = function(file) {
    return encodeURIComponent(crypto.createHash('md5').update(cache[file]).digest('base64'));
  };
  return fs.readFile(file, 'utf8', function(err, html) {
    var content, done, file, scripts;
    if (err != null) {
      return clbk(err);
    }
    html = html.replace('</head>', '<script>var conf=' + JSON.stringify(opt) + ';</script></head>');
    if (opt['noappcache'] === true) {
      html = html.replace('<html', "<html manifest='/manifest.appcache?v=" + (hash('/manifest.appcache')) + "'");
    }
    html = html.replace('</head>', "<link rel='stylesheet' href='/style.css?v=" + (hash('/style.css')) + "'></head>");
    if (opt.prerender) {
      cache.cleanIndex = html;
    }
    html = html.replace('</body>', "<script src='" + opt.serverUri + "/api-library.js'></script></body>");
    done = function() {
      cache['/index.html'] = html;
      return clbk();
    };
    if (opt.concatJS) {
      html = html.replace('</body>', "<script src='/main.js?v=" + (hash('/manifest.appcache')) + "'></script></body>");
      return done();
    } else {
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
        cache['/loader.js'] = content;
        scripts += "<script src='/loader.js?v=" + (hash('/loader.js')) + "'></script>";
        _ref = files.output;
        for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
          file = _ref[_j];
          scripts += "<script src='" + file + "?v=" + (hash(file)) + "'></script>";
        }
        html = html.replace('</body>', scripts + '</body>');
        return done();
      });
    }
  });
};
exports.compile = compile;