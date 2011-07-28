
http = require 'http'
url = require 'url'
path = require 'path'
mime = require 'mime'
render = require './render'
fs = require 'fs'
cli = require 'cli'


exports.run = (opt) ->
  mime.define 'text/cache-manifest': ['appcache', 'appCache']

  onRequest = (req, res) ->
    pathname = url.parse(req.url).pathname
    filename = path.join opt.build, pathname

    path.exists filename, (exists) ->

      if not exists?
        render.run opt, res

      else
        fs.stat filename, (err, stat) ->
          return errEnd "Something wrong with stat: #{err}" if err?

          return render.run opt, res if stat.isDirectory()

          fs.readFile filename, 'binary', (err, file) ->
            return errEnd "Unable to read file #{filename}" if err?

            cli.info 'GET 200 '+pathname
            res.writeHead 200, 'Content-Type': mime.lookup(filename)
            res.write file, 'binary'
            res.end()


    errEnd = (err) ->
      res.writeHead 500, 'Content-Type': 'text/plain'
      res.write err + '\n'
      res.end()

  server = http.createServer(onRequest).listen(opt.port, opt.host)
  console.log "server listening - http://#{opt.host}:#{opt.port}"
