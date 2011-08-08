var cleanOpt, cli, fs, serve, _;
cli = require('cli');
fs = require('fs');
_ = require('underscore')._;
serve = require('./serve');
cli.parse({
  src: ['s', 'Source directory', 'path', './src'],
  host: ['h', 'Address to serve on', 'string', '0.0.0.0'],
  port: ['p', 'Serve on port', 'number', 3000],
  autobuild: ['b', 'Automatically rebuild on file change', 'boolean', false],
  prerender: ['r', 'Prerender pages before serving', 'boolean', false],
  noappcache: ['n', 'Disable HTML5 Application Cache', 'boolean', false],
  jsconf: ['c', 'JSON config file', 'path', './localConf.json'],
  concat: [false, 'Connatinate js info one file', 'boolean', false],
  minify: ['m', 'Minify JS using Uglify JS', 'boolean', false],
  pretify: ['p', 'Pretify minified JS using Uglify JS', 'boolean', false]
});
cleanOpt = function(opt, clbk) {
  if (opt.minify) {
    opt.concat = true;
  }
  return fs.realpath(opt.src, function(err, srcPath) {
    if (err != null) {
      cli.fatal(err);
    }
    opt.src = srcPath;
    return fs.readFile(opt.src + '/conf.json', 'utf8', function(err, data) {
      if (err != null) {
        cli.fatal(err);
      }
      return fs.readFile(opt.jsconf, 'utf8', function(err, localData) {
        if (err != null) {
          cli.fatal(err);
        }
        opt.conf = _.extend({}, JSON.parse(data), JSON.parse(localData));
        return clbk(opt);
      });
    });
  });
};
cli.main(function(args, opt) {
  if (opt.silent) {
    cli.status = function() {};
  }
  return cleanOpt(opt, function(opt) {
    return serve.run(opt);
  });
});