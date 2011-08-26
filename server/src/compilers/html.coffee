
crypto = require 'crypto'
fs = require 'fs'
depends = require 'depends'
require 'colors'


compile = (files, opt, cache, clbk) ->
  file = null

  for f in files
    if /\.html$/.test f
      file = f
      break

  return clbk() if not file?

  console.log 'building html'.magenta


  hash = (file)-> encodeURIComponent crypto.createHash('md5').update(cache[file]).digest('base64')


  fs.readFile file, 'utf8', (err, html)->
    return clbk err if err?

    # conf
    html = html.replace '</head>', '<script>var conf='+JSON.stringify(opt)+';</script></head>'

    # appcache
    if opt['noappcache'] == true
      html = html.replace '<html', "<html manifest='/manifest.appcache?v=#{hash('/manifest.appcache')}'"

    #CSS
    html = html.replace '</head>', "<link rel='stylesheet' href='/style.css?v=#{hash('/style.css')}'></head>"

    cache.cleanIndex = html if opt.prerender

    # JavaScript
    html = html.replace '</body>', "<script src='#{opt.serverUri}/api-library.js'></script></body>"

    done = ->
      cache['/index.html'] = html
      clbk()

    if opt.concatJS
      html = html.replace '</body>', "<script src='/main.js?v=#{hash('/manifest.appcache')}'></script></body>"
      done()

    else
      scripts = ''

      files = new depends.Files()

      files.js = {}
      for file, content of cache
        files.js[file] = content if /\.js$/.test file

      files.getClient false, (err, content) ->
        return clbk err if err?

        cache['/loader.js'] = content
        scripts += "<script src='/loader.js?v=#{hash('/loader.js')}'></script>"

        for file in files.output
          scripts += "<script src='#{file}?v=#{hash(file)}'></script>"

        html = html.replace '</body>', scripts+'</body>'

        done()


exports.compile = compile
