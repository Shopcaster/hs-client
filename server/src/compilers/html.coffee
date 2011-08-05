
fs = require 'fs'
depends = require 'depends'


compile = (files, opt, cache, clbk) ->

  file = f if /\.html$/.test f for f in files

  return clbk() if not file?

  fs.readFile file, 'utf8', (err, html)->
    return clbk err if err?

    # conf
    html.replace '</head>', JSON.stringify(opt.conf)+'</head>'


    # appcache
    manifestFilename = '/manifest.appcache'
    manifest = ''

    manifest += 'CACHE MANIFEST\n'

    stamp = Math.round(new Date().getTime() / 1000)
    manifest += "#built: #{stamp}\n\n"

    manifest += 'NETWORK:\n*\n\n'

    if not opt['noappcache']
      manifest += 'CACHE:\n';

      for file, content of cache
        minifest += file +'\n'

    cache[manifestFilename] = manifest

    html.replace '<html', "<html manifest='#{manifestFilename}'"


    # JavaScript
    html.replace '</body>', "<script src='#{opt.conf.zz.server.protocol}://#{opt.conf.zz.server.host}:#{opt.conf.zz.server.port}/api-library.js'></script></body>"

    scripts = ''

    files = new depends.Files()

    files.js = {}
    files.js[file] = content if /\.js$/.test file for file, content of cache

    files.getClient false, (err, content) ->
      return clbk err if err?

      scripts += '<script src="/loader.js"></script>'
      cache['/loader.js'] = content

      scripts += '<script src="/#{file}"></script>' for file in files.output

      html.replace '</body>', scripts+'</body>'

      cache['/index.html'] = html
      clbk()

exports.compile = compile
