#!/usr/bin/env node

var cli = require('cli').enable('status'),
    fs = require('fs'),
    _ = require('underscore')._;

var commands = {
  build: require('./builder/main.js'),
  serve: require('./server/server.js'),
}

cli.parse({

  //options

  src: ['s', 'Source directory', 'path', './src'],
  build: ['b', 'Build directory', 'path', './build'],

  verbose: ['v', 'Print more', 'boolean', false],
  silent: ['s', 'stop output', 'boolean', false],


  //server
  host:  ['a', 'Address to serve on', 'string', '0.0.0.0'],
  port:  ['p', 'Serve on port', 'number', 3000],

  autorestart:  [false, 'Autorestart on file change', 'boolean', false],


  //builder
  noappcache: [false, 'Disable HTML5 Application Cache', 'boolean', false],
  jsconf: ['c', 'JSON config file', 'path', './localConf.json'],
  test: ['t', 'Build js with tests', 'boolean', false],
  minify: ['m', 'Minify JS using Uglify JS', 'boolean', false],
  pretify: ['p', 'Pretify minified JS using Uglify JS', 'boolean', false],

}, _.keys(commands));


cli.main(function(args, opt){
  if (opt.silent)
    cli.status = function (msg, type) {}

  cleanOpt(opt, function(opt){
    cli.debug('options: '+ JSON.stringify(opt));
    commands[cli.command].run(opt);
  });
});


function cleanOpt(opt, clbk){
  fs.realpath(opt.build, function(err, buildPath){
    if (err) cli.fatal(err);
    opt.build = buildPath;
    fs.realpath(opt.src, function(err, srcPath){
      if (err) cli.fatal(err);
      opt.src = srcPath;
      addConf(opt, clbk);
    });
  });
}

function addConf(opt, clbk){
  fs.readFile(opt.src+'/conf.json', 'utf8', function(err, data){
    if (err) return clbk(err);
    data = JSON.parse(data);

    var done = function(){
      opt.conf = data;
      clbk(opt);
    };

    fs.readFile(opt.jsconf, 'utf8', function(err, localData){
      if (err) return done();
      _.extend(data, JSON.parse(localData));
      done();
    });
    ;
  });
}
