
http = require 'http'
url = require 'url'
path = require 'path'
fs = require 'fs'
cli = require 'cli'
require 'colors'

build = require './build'
render = require './render'


cache = {}


exports.run = (opt) ->

  onRequest = (req, res) ->
    pathname = url.parse(req.url).pathname
    filename = path.join opt.build, pathname

    if cache[pathname]?
      console.log ('GET 200 '+pathname).grey
      res.writeHead 200, 'Content-Type': mime(filename)
      res.write cache[pathname], 'binary'
      res.end()

    else
      opt.pathname = pathname
      render.route pathname, (status, content)->
        status = 200 if not status?

        lg = ('GET '+status+' '+pathname).bold
        lg = lg.red if status != 200
        console.log lg
        res.writeHead status, 'Content-Type': 'text/html; charset=utf-8'
        res.write content
        res.end()

    errEnd = (err) ->
      console.log 'ERROR'.red
      console.log err.stack.red
      res.writeHead 500, 'Content-Type': 'text/plain; charset=utf-8'
      res.write err + '\n'
      res.end()


  build.buildDir opt.src, opt, cache, (err)->
    return cli.fatal err if err?

    render.init cache, opt, (err)->
      return cli.fatal err if err?

      server = http.createServer(onRequest).listen(opt.port, opt.host)
      console.log "server listening - http://#{opt.host}:#{opt.port}"




mime = (filename)->
  parsed = /\.(\w+)$/.exec(filename)

  return 'text/plain; charset=utf-8' if not parsed?

  switch parsed[1]
    when 'png' then return 'image/png'
    when 'jpg' then return 'image/jpeg'
    when 'gif' then return 'image/gif'
    when 'ico' then return 'image/vnd.microsoft.icon'

    when 'js' then return 'application/javascript; charset=utf-8'

    when 'appcache' then return 'text/cache-manifest; charset=utf-8'
    when 'html' then return 'text/html; charset=utf-8'
    when 'css' then return 'text/css; charset=utf-8'
