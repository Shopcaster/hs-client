var cli, fs, http, mime, path, render, url;
http = require('http');
url = require('url');
path = require('path');
mime = require('mime');
render = require('./render');
fs = require('fs');
cli = require('cli');
exports.run = function(opt) {
  var onRequest, server;
  mime.define({
    'text/cache-manifest': ['appcache', 'appCache']
  });
  onRequest = function(req, res) {
    var errEnd, filename, pathname;
    pathname = url.parse(req.url).pathname;
    filename = path.join(opt.build, pathname);
    path.exists(filename, function(exists) {
      if (!(exists != null)) {
        return render.run(opt, res);
      } else {
        return fs.stat(filename, function(err, stat) {
          if (err != null) {
            return errEnd("Something wrong with stat: " + err);
          }
          if (stat.isDirectory()) {
            return render.run(opt, res);
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
  server = http.createServer(onRequest).listen(opt.port, opt.host);
  return console.log("server listening - http://" + opt.host + ":" + opt.port);
};