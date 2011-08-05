var build, cache, cli, fs, http, mime, path, render, url;
http = require('http');
url = require('url');
path = require('path');
fs = require('fs');
cli = require('cli');
require('colors');
build = require('./build');
render = require('./render');
cache = {};
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
      opt.pathname = pathname;
      render.route(pathname, function(status, content) {
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
        return res.end();
      });
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
    if (err != null) {
      return cli.fatal(err);
    }
    return render.init(cache, opt, function(err) {
      var server;
      if (err != null) {
        return cli.fatal(err);
      }
      server = http.createServer(onRequest).listen(opt.port, opt.host);
      return console.log("server listening - http://" + opt.host + ":" + opt.port);
    });
  });
};
mime = function(filename) {
  var parsed;
  parsed = /\.(\w+)$/.exec(filename);
  if (!(parsed != null)) {
    return 'text/plain; charset=utf-8';
  }
  switch (parsed[1]) {
    case 'png':
      return 'image/png';
    case 'jpg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'ico':
      return 'image/vnd.microsoft.icon';
    case 'js':
      return 'application/javascript; charset=utf-8';
    case 'appcache':
      return 'text/cache-manifest; charset=utf-8';
    case 'html':
      return 'text/html; charset=utf-8';
    case 'css':
      return 'text/css; charset=utf-8';
  }
};