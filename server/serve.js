var build, cache, cli, fs, http, mime, path, render, url;
http = require('http');
url = require('url');
path = require('path');
mime = require('mime');
fs = require('fs');
cli = require('cli');
require('colors');
build = require('./build');
render = require('./render');
cache = {};
exports.run = function(opt) {
  var onRequest;
  mime.define({
    'text/cache-manifest': ['appcache', 'appCache']
  });
  onRequest = function(req, res) {
    var errEnd, filename, pathname, route;
    pathname = url.parse(req.url).pathname;
    filename = path.join(opt.build, pathname);
    route = function() {
      opt.pathname = pathname;
      return render.route(pathname, function(status, content) {
        if (!(status != null)) {
          status = 200;
        }
        console.log(('GET ' + status + ' ' + pathname).bold);
        res.writeHead(status, {
          'Content-Type': 'text/html'
        });
        res.write(content);
        return res.end();
      });
    };
    path.exists(filename, function(exists) {
      if (!exists) {
        return route();
      } else {
        return fs.stat(filename, function(err, stat) {
          if (err != null) {
            return errEnd("stat: " + err);
          }
          if (stat.isDirectory()) {
            return route();
          }
          return fs.readFile(filename, 'binary', function(err, file) {
            if (err != null) {
              return errEnd("Unable to read file " + filename);
            }
            console.log(('GET 200 ' + pathname).grey);
            res.writeHead(200, {
              'Content-Type': mime.lookup(filename)
            });
            res.write(file, 'binary');
            return res.end();
          });
        });
      }
    });
    return errEnd = function(err) {
      console.log('ERROR'.red);
      console.log(err.stack.red);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.write(err + '\n');
      return res.end();
    };
  };
  return build.buildDir(opt.src, opt, cache, function(err) {
    if (err != null) {
      return cli.fatal(err);
    }
    return render.init(opt, function(err) {
      var server;
      if (err != null) {
        return cli.fatal(err);
      }
      server = http.createServer(onRequest).listen(opt.port, opt.host);
      return console.log("server listening - http://" + opt.host + ":" + opt.port);
    });
  });
};