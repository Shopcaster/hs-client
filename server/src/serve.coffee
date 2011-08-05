
http = require 'http'
url = require 'url'
path = require 'path'
mime = require 'mime'
fs = require 'fs'
cli = require 'cli'
require 'colors'

build = require './build'
render = require './render'


cache = {}


exports.run = (opt) ->
  mime.define 'text/cache-manifest': ['appcache', 'appCache']

  onRequest = (req, res) ->
    pathname = url.parse(req.url).pathname
    filename = path.join opt.build, pathname


    route = ->
      opt.pathname = pathname
      render.route pathname, (status, content)->
        status = 200 if not status?

        console.log ('GET '+status+' '+pathname).bold
        res.writeHead status, 'Content-Type': 'text/html'
        res.write content
        res.end()


    path.exists filename, (exists) ->

      if not exists
        route()
      else
        fs.stat filename, (err, stat) ->
          return errEnd "stat: #{err}" if err?

          return route() if stat.isDirectory()

          fs.readFile filename, 'binary', (err, file) ->
            return errEnd "Unable to read file #{filename}" if err?

            console.log ('GET 200 '+pathname).grey
            res.writeHead 200, 'Content-Type': mime.lookup(filename)
            res.write file, 'binary'
            res.end()


    errEnd = (err) ->
      console.log 'ERROR'.red
      console.log err.stack.red
      res.writeHead 500, 'Content-Type': 'text/plain'
      res.write err + '\n'
      res.end()


  build.buildDir opt.src, opt, cache, (err)->
    return cli.fatal err if err?

    render.init opt, (err)->
      return cli.fatal err if err?

      server = http.createServer(onRequest).listen(opt.port, opt.host)
      console.log "server listening - http://#{opt.host}:#{opt.port}"
