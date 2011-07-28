
exports.name = 'Include ZZ'

exports.run = (srcDir, buildDir, files, output, opt, clbk) ->
  output.head += "
    <script src='#{opt.conf.zz.server.protocol}://#{opt.conf.zz.server.host}:#{opt.conf.zz.server.port}/api-library.js'></script>
  "
  clbk null, output, files
