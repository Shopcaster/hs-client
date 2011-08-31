
http = require 'http'
url = require 'url'
path = require 'path'
fs = require 'fs'
cli = require 'cli'
require 'colors'

build = require './build'
render = require './render'


cache = {}
gzip = {}

mimetypes =
  png: 'image/png'
  jpg: 'image/jpeg'
  gif: 'image/gif'
  ico: 'image/vnd.microsoft.icon'
  svg: 'image/svg'

  mp4: 'video/mp4'
  ogg: 'video/ogg'
  webm: 'video/webm'

  eot: 'application/vnd.ms-fontobject'
  js: 'application/javascript; charset=utf-8'

  appcache: 'text/cache-manifest; charset=utf-8'
  html: 'text/html; charset=utf-8'
  css: 'text/css; charset=utf-8'


doRender = (res, pathname)->
  render.route pathname, (status, htm)->

    write = (content)->
      status = 200 if not status?

      lg = ('GET '+status+' '+pathname).bold
      lg = lg.red if status != 200
      console.log lg

      res.writeHead status,
        'Content-Type': 'text/html; charset=utf-8'
        'Cache-Control': 'no-cache'
      res.write content
      res.end()

    if opt.gzip and req.headers['accept-encoding']? and
        'gzip' in req.headers['accept-encoding'].split(',')
      gzip content, (err, zipd)->
        if not err?
          write zipd
        else
          write htm
    else
      write htm


exports.run = (opt) ->

  serve = (pathname, req, res)->
    headers = {}
    headers['Content-Type'] = mime pathname

    if pathname == '/index.html' or pathname == '/manifest.appcache'
      headers['Cache-Control'] = 'no-cache'
    else
      headers['Cache-Control'] = 'max-age=31536000'

    if opt.gzip and
        req.headers['accept-encoding']? and
        'gzip' in req.headers['accept-encoding'].split(',')
      headers['Content-Encoding'] = 'gzip'
      content = gzip[pathname]
    else
      content = cache[pathname]

    res.writeHead 200, headers
    res.write content, 'binary'
    res.end()
    console.log ('GET 200 '+pathname).grey


  onRequest = (req, res) ->
    pathname = opt.pathname = url.parse(req.url).pathname
    try
      if (opt.gzip and gzip[pathname]?) or cache[pathname]?
        serve pathname, req, res

      else if opt.prerender and render.ready
        doRender res, pathname

      else
        serve '/index.html', req, res

    catch err
      console.log ('GET 500 '+pathname).red
      console.log err.stack.red
      res.writeHead 500, 'Content-Type': 'text/plain; charset=utf-8'
      res.write '<h1>500</h1><p>oops.</p>'
      res.end()


  autoBuild = ->
    # Autobuild
    watchRecursive opt.clientSource, (file)->
      console.log 'File change detected'.yellow

      build.build [file], opt, cache, (err)->
        return console.log 'ERROR:'.red, err if err?

        if opt.gzip
          build.gzip file: cache[file], gzip, (err)->
            return console.log 'ERROR:'.red, err if err?
        ###
        if opt.prerender and  /\.(\w+)$/.exec(file)[1] in ['coffee', 'html']
          console.log 'Reloading render'.yellow

          render.init cache, opt, (err)->
            return cli.fatal err if err?
            console.log 'render reload complete'.yellow
        ###


  startServe = (err)->
    return cli.fatal err if err?
    #serve
    ##TODO: make this configurable.
    server = http.createServer(onRequest).listen(3000, '0.0.0.0')
    console.log "server listening - http://0.0.0.0:3000"

    ## start renderer
    if opt.prerender
      console.log 'initializing render'.magenta
      render.init cache, opt

    autoBuild() if opt.autobuild


  # initial build
  build.buildDir opt.clientSource, opt, cache, (err)->
    return cli.fatal err if err?

    if opt.gzip
      build.gzip cache, gzip, startServe
    else
      startServe()




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

  for ext, type of mimetypes
    if parsed[1] == ext
      return type
