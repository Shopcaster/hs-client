
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

  fs.readFile file, 'utf8', (err, html)->
    return clbk err if err?

    # conf
    html = html.replace '</head>', '<script>var conf='+JSON.stringify(opt)+';</script></head>'


    # appcache
    if not opt['noappcache']
      html = html.replace '<html', "<html manifest='/manifest.appcache'"


    #CSS
    html = html.replace '</head>', "<link rel='stylesheet' href='/style.css'></head>"


    # JavaScript
    html = html.replace '</body>', "<script src='#{opt.serverUri}/api-library.js'></script></body>"

    done = ->
      cache['/index.html'] = html
      clbk()

    if opt.concatJS
      html = html.replace '</body>', '<script src="/main.js"></script></body>'
      done()

    else
      scripts = ''

      files = new depends.Files()

      files.js = {}
      for file, content of cache
        files.js[file] = content if /\.js$/.test file

      files.getClient false, (err, content) ->
        return clbk err if err?

        scripts += '<script src="/loader.js"></script>'
        cache['/loader.js'] = content

        for file in files.output
          scripts += "<script src='#{file}'></script>"

        html = html.replace '</body>', scripts+'</body>'

        done()


exports.compile = compile
