var cli, fs, http, mime, path, render, url;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
http = require('http');
url = require('url');
path = require('path');
mime = require('mime');
render = require('./render');
fs = require('fs');
cli = require('cli');
exports.run = function(opt) {
  var onRequest;
  mime.define({
    'text/cache-manifest': ['appcache', 'appCache']
  });
  onRequest = function(req, res) {
    var errEnd, filename, pathname, route;
    pathname = url.parse(req.url).pathname;
    filename = path.join(opt.build, pathname);
    route = __bind(function() {
      opt.pathname = pathname;
      return render.route(pathname, function(err, content) {
        if (err != null) {
          return errEnd("render: " + err);
        }
        cli.info('GET 200 ' + pathname);
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });
        res.write(content);
        return res.end();
      });
    }, this);
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
            cli.info('GET 200 ' + pathname);
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
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.write(err + '\n');
      return res.end();
    };
  };
  return render.init(opt, function() {
    var server;
    server = http.createServer(onRequest).listen(opt.port, opt.host);
    return console.log("server listening - http://" + opt.host + ":" + opt.port);
  });
};