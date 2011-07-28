
dep.provide 'zz'

###
loadScript = (script) ->
  document.write '<script src="'+script+'"></script>'


loadScript "#{conf.zz.server.protocol}://#{conf.zz.server.host}:#{conf.zz.server.port}/socket.io/socket.io.js"

loadScript "#{conf.zz.server.protocol}://#{conf.zz.server.host}:#{conf.zz.server.port}/api-library.js"

###
