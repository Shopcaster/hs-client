
var http = require('http'),
    parseURL = require('url').parse,
    build = require('build.js');

if (process.argv.length < 3)
    throw('must specify build type');
var buildType = process.argv[2];

http.createServer(function (req, res) {
  var uri = url.parse(request.url).pathname,
      filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    fs.stat(filename, function(err, stat){
        if (stat.isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
          if(err) {        
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(err + "\n");
            response.end();
            return;
          }

          response.writeHead(200);
          response.write(file, "binary");
          response.end();
        });
    });
  });
}).listen(3000, "0.0.0.0");

console.log('Server running at http://0.0.0.0:3000/');
