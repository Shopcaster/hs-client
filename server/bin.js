var cleanOpt, cli, fs, mash, serve, _;
var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] === item) return i;
  }
  return -1;
};
cli = require('cli');
fs = require('fs');
_ = require('underscore')._;
serve = require('./serve');
cli.parse({
  settings: ['t', 'JSON config file or predefined mode', 'path', './lsettings.json'],
  clientSource: ['s', 'Source directory', 'path'],
  clientUri: ['u', 'Address to serve on', 'string'],
  autobuild: ['b', 'Automatically rebuild on file change', 'boolean'],
  prerender: ['r', 'Prerender pages before serving', 'boolean'],
  appcache: ['a', 'HTML5 Application Cache', 'boolean'],
  concat: ['c', 'Connatinate js info one file', 'boolean'],
  minify: ['m', 'Minify JS using Uglify JS', 'boolean']
});
mash = function() {
  var key, obj, objs, res, val, _i, _len;
  objs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
  res = {};
  for (_i = 0, _len = objs.length; _i < _len; _i++) {
    obj = objs[_i];
    for (key in obj) {
      if (!__hasProp.call(obj, key)) continue;
      val = obj[key];
      if (val != null) {
        res[key] = val;
      }
    }
  }
  return res;
};
cleanOpt = function(opt, clbk) {
  var lsettings, settings, _ref;
  if (opt.minify) {
    opt.concat = true;
  }
  settings = fs.readFileSync(__dirname + '/../settings.json', 'utf8');
  settings = JSON.parse(settings);
  if (_ref = opt.settings, __indexOf.call(Object.keys(settings), _ref) >= 0) {
    settings = mash(settings["default"], settings[opt.settings], opt);
  } else if (fs.statSync(opt.settings).isFile()) {
    lsettings = fs.readFileSync(opt.settings, 'utf8');
    lsettings = JSON.parse(lsettings);
    settings = mash(settings["default"], lsettings, opt);
  }
  delete settings.settings;
  return clbk(settings);
};
cli.main(function(args, opt) {
  if (opt.silent) {
    cli.status = function() {};
  }
  return cleanOpt(opt, function(opt) {
    return serve.run(opt);
  });
});