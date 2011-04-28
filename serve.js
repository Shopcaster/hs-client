#!/usr/bin/env node

var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    mime = require('mime'),
    exec = require('child_process').exec,
    build = require('./build.js');

mime.define({
    'text/cache-manifest': ['appcache', 'appCache'],
});

var server = http.createServer(function (req, res) {
  var uri = url.parse(req.url).pathname,
      filename = path.join(build.buildDir, uri);

  path.exists(filename, function(exists) {
    if(!exists) {
      res.writeHead(404, {"Content-Type": "text/plain"});
      res.write("404 Not Found\n");
      res.end();
      return;
    }

    fs.stat(filename, function(err, stat){
        if (stat.isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
          if(err) {
            res.writeHead(500, {"Content-Type": "text/plain"});
            res.write(err + "\n");
            res.end();
            return;
          }

          res.writeHead(200, {"Content-Type": mime.lookup(filename)});
          res.write(file, "binary");
          res.end();
        });
    });
  });
});

server.listen(3000, "0.0.0.0");

(function waitForChange(){
    exec('inotifywait -r '+build.srcDir, function(){
        build.build(function(){
            waitForChange();
        });
    });
})();


console.log('Server running at http://0.0.0.0:3000/');
