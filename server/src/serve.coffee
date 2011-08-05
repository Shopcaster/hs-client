
http = require 'http'
url = require 'url'
path = require 'path'
fs = require 'fs'
cli = require 'cli'
require 'colors'

build = require './build'
render = require './render'


cache = {}

mimetypes =
  png: 'image/png'
  jpg: 'image/jpeg'
  gif: 'image/gif'
  ico: 'image/vnd.microsoft.icon'

  js: 'application/javascript; charset=utf-8'

  appcache: 'text/cache-manifest; charset=utf-8'
  html: 'text/html; charset=utf-8'
  css: 'text/css; charset=utf-8'


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

    console.log 'initializing render'.magenta
    render.init cache, opt, (err)->
      return cli.fatal err if err?

      server = http.createServer(onRequest).listen(opt.port, opt.host)
      console.log "server listening - http://#{opt.host}:#{opt.port}"

      if opt.autobuild
        watchRecursive opt.src, (file)->
          console.log 'File change detected'.yellow

          build.build [file], opt, cache, ->

            if /\.(\w+)$/.exec(file)[1] in ['js', 'html']
              console.log 'Reloading render'.yellow

              render.init cache, opt, (err)->
                return cli.fatal err if err?
                console.log 'render reload complete'.yellow


watchRecursive = (path, clbk)->
  fs.stat path, (err, stats)->
    throw err if err?

    if stats.isDirectory()
      fs.readdir path, (err, files)->
        throw err if err?

        for file in files
          watchRecursive path+'/'+file, clbk

    else
      fs.watchFile path, (cur, prev)->
        if cur.mtime.getTime() != prev.mtime.getTime()
          clbk path


mime = (filename)->
  parsed = /\.(\w+)$/.exec(filename)
  return 'text/plain; charset=utf-8' if not parsed?

  for ext, type in mimetypes
    if parsed[1] == ext
      return type
