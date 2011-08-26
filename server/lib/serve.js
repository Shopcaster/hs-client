var build, cache, cli, doRender, fs, gzip, http, mime, mimetypes, path, render, renderQ, rendering, url, watchRecursive;
var __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
http = require('http');
url = require('url');
path = require('path');
fs = require('fs');
cli = require('cli');
require('colors');
build = require('./build');
render = require('./render');
cache = {};
gzip = {};
mimetypes = {
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  ico: 'image/vnd.microsoft.icon',
  svg: 'image/svg',
  mp4: 'video/mp4',
  ogg: 'video/ogg',
  webm: 'video/webm',
  eot: 'application/vnd.ms-fontobject',
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
    rendering = false;
    if (renderQ.length) {
      return renderQ.pop()();
    }
  });
};
exports.run = function(opt) {
  var autoBuild, onRequest, startServe;
  onRequest = function(req, res) {
    var content, errEnd, headers, pathname;
    pathname = opt.pathname = url.parse(req.url).pathname;
    if ((opt.gzip && (gzip[pathname] != null)) || (cache[pathname] != null)) {
      console.log(('GET 200 ' + pathname).grey);
      headers = {
        'Content-Type': mime(pathname),
        'Cache-Control': 'max-age=31536000'
      };
      if (opt.gzip && (req.headers['accept-encoding'] != null) && __indexOf.call(req.headers['accept-encoding'].split(','), 'gzip') >= 0) {
        headers['Content-Encoding'] = 'gzip';
        content = gzip[pathname];
      } else {
        content = cache[pathname];
      }
      res.writeHead(200, headers);
      res.write(content, 'binary');
      res.end();
    } else if (opt.prerender && render.ready) {
      if (!rendering) {
        doRender(res, pathname);
      } else {
        renderQ.push(function() {
          return doRender(res, pathname);
        });
      }
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
  autoBuild = function() {
    return watchRecursive(opt.clientSource, function(file) {
      console.log('File change detected'.yellow);
      return build.build([file], opt, cache, function(err) {
        if (err != null) {
          return console.log('ERROR:'.red, err);
        }
        if (opt.gzip) {
          return build.gzip({
            file: cache[file]
          }, gzip, function(err) {
            if (err != null) {
              return console.log('ERROR:'.red, err);
            }
          });
        }
        /*
                if opt.prerender and  /\.(\w+)$/.exec(file)[1] in ['coffee', 'html']
                  console.log 'Reloading render'.yellow
        
                  render.init cache, opt, (err)->
                    return cli.fatal err if err?
                    console.log 'render reload complete'.yellow
                */
      });
    });
  };
  startServe = function(err) {
    var server;
    if (err != null) {
      return cli.fatal(err);
    }
    server = http.createServer(onRequest).listen(3000, '0.0.0.0');
    console.log("server listening - http://0.0.0.0:3000");
    if (opt.prerender) {
      console.log('initializing render'.magenta);
      setTimeout((function() {
        return render.init(cache, opt);
      }), 100);
    }
    if (opt.autobuild) {
      return autoBuild();
    }
  };
  return build.buildDir(opt.clientSource, opt, cache, function(err) {
    if (err != null) {
      return cli.fatal(err);
    }
    if (opt.gzip) {
      return build.gzip(cache, gzip, startServe);
    } else {
      return startServe();
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