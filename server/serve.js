var build, cache, cli, doRender, fs, http, mime, mimetypes, path, render, renderQ, rendering, url, watchRecursive;
http = require('http');
url = require('url');
path = require('path');
fs = require('fs');
cli = require('cli');
require('colors');
build = require('./build');
render = require('./render');
cache = {};
mimetypes = {
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  ico: 'image/vnd.microsoft.icon',
  js: 'application/javascript; charset=utf-8',
  appcache: 'text/cache-manifest; charset=utf-8',
  html: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8'
};
renderQ = [];
rendering = false;
doRender = function(res, pathname) {
  rendering = true;
  return render.route(pathname, function(status, content) {
    var lg;
    rendering = false;
    if (!(status != null)) {
      status = 200;
    }
    lg = ('GET ' + status + ' ' + pathname).bold;
    if (status !== 200) {
      lg = lg.red;
    }
    console.log(lg);
    res.writeHead(status, {
      'Content-Type': 'text/html; charset=utf-8'
    });
    res.write(content);
    res.end();
    if (renderQ.length) {
      return renderQ.pop()();
    }
  });
};
exports.run = function(opt) {
  var onRequest;
  onRequest = function(req, res) {
    var errEnd, filename, pathname;
    pathname = url.parse(req.url).pathname;
    filename = path.join(opt.build, pathname);
    if (cache[pathname] != null) {
      console.log(('GET 200 ' + pathname).grey);
      res.writeHead(200, {
        'Content-Type': mime(filename)
      });
      res.write(cache[pathname], 'binary');
      res.end();
    } else {
      console.log('GET 200 /index.html');
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.write(cache['/index.html']);
      res.end();
    }
    return errEnd = function(err) {
      console.log('ERROR'.red);
      console.log(err.stack.red);
      res.writeHead(500, {
        'Content-Type': 'text/plain; charset=utf-8'
      });
      res.write(err + '\n');
      return res.end();
    };
  };
  return build.buildDir(opt.src, opt, cache, function(err) {
    var server;
    if (err != null) {
      return cli.fatal(err);
    }
    server = http.createServer(onRequest).listen(opt.port, opt.host);
    console.log("server listening - http://" + opt.host + ":" + opt.port);
    if (opt.autobuild) {
      return watchRecursive(opt.src, function(file) {
        console.log('File change detected'.yellow);
        return build.build([file], opt, cache);
      });
    }
  });
};
watchRecursive = function(path, clbk) {
  return fs.stat(path, function(err, stats) {
    if (err != null) {
      throw err;
    }
    if (stats.isDirectory()) {
      return fs.readdir(path, function(err, files) {
        var file, _i, _len, _results;
        if (err != null) {
          throw err;
        }
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          _results.push(watchRecursive(path + '/' + file, clbk));
        }
        return _results;
      });
    } else {
      return fs.watchFile(path, function(cur, prev) {
        if (cur.mtime.getTime() !== prev.mtime.getTime()) {
          return clbk(path);
        }
      });
    }
  });
};
mime = function(filename) {
  var ext, parsed, type;
  parsed = /\.(\w+)$/.exec(filename);
  if (!(parsed != null)) {
    return 'text/plain; charset=utf-8';
  }
  for (ext in mimetypes) {
    type = mimetypes[ext];
    if (parsed[1] === ext) {
      return type;
    }
  }
};