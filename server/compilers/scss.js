var compile, exec;
exec = require('child_process').exec;
require('colors');
compile = function(files, opt, cache, clbk) {
  var file, scss, _i, _len;
  scss = false;
  for (_i = 0, _len = files.length; _i < _len; _i++) {
    file = files[_i];
    if (/\.scss$/.test(file)) {
      scss = true;
      break;
    }
  }
  if (!scss) {
    return clbk();
  }
  console.log('building scss'.magenta);
  return exec("sass " + opt.src + "/css/style.scss", function(err, stdout, stderr) {
    if (err != null) {
      return clbk(err.stack);
    }
    if ((stderr != null) && stderr !== '') {
      return clbk(strerr);
    }
    cache['/style.css'] = stdout;
    return clbk();
  });
};
exports.compile = compile;