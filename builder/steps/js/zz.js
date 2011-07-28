exports.name = 'Include ZZ';
exports.run = function(srcDir, buildDir, files, output, opt, clbk) {
  output.head += "    <script src='" + opt.conf.zz.server.protocol + "://" + opt.conf.zz.server.host + ":" + opt.conf.zz.server.port + "/api-library.js'></script>  ";
  return clbk(null, output, files);
};