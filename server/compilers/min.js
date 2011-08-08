var compile, depends, fs, ug;
ug = require('uglify-js');
fs = require('fs');
depends = require('depends');
require('colors');
compile = function(files, opt, cache, clbk) {
  var content, file;
  if (!opt.minify && !opt.concat) {
    return clbk();
  }
  console.log('minifying js'.magenta);
  files = new depends.Files();
  files.js = {};
  for (file in cache) {
    content = cache[file];
    if (/\.js$/.test(file)) {
      files.js[file] = content;
    }
  }
  return files.getClient(false, function(err, loader) {
    var ast, file, js, _i, _len, _ref;
    if (err != null) {
      return clbk(err);
    }
    js = '';
    js += loader;
    _ref = files.output;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      file = _ref[_i];
      js += files.js[file];
    }
    if (opt.minify) {
      ast = ug.parser.parse(js);
      ast = ug.uglify.ast_mangle(ast, {
        toplevel: true
      });
      ast = ug.uglify.ast_squeeze(ast);
      js = ug.uglify.gen_code(ast, {
        beautify: opt.pretify,
        indent_level: 2
      });
    }
    cache['/main.js'] = js;
    return clbk();
  });
};
exports.compile = compile;