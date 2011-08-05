
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
    html = html.replace '</head>', '<script>var conf='+JSON.stringify(opt.conf)+';</script></head>'


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
        manifest += file+'\n'

      html = html.replace '<html', "<html manifest='#{manifestFilename}'"

    cache[manifestFilename] = manifest



    #CSS
    html = html.replace '</head>', "<link rel='stylesheet' href='/style.css'></head>"


    # JavaScript
    html = html.replace '</body>', "<script src='#{opt.conf.zz.server.protocol}://#{opt.conf.zz.server.host}:#{opt.conf.zz.server.port}/api-library.js'></script></body>"

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

      cache['/index.html'] = html
      clbk()

exports.compile = compile
