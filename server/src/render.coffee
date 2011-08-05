
depends = require 'depends'
jsdom  = require("jsdom").jsdom
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
fs = require 'fs'
require 'colors'

# module vars
dep = null
cache = null

# initialize
exports.init = (c, opt, clbk)->
  cache = c

  index = cache['/index.html']

  doc = jsdom index, null,
    features:
      FetchExternalResources: false

  window = doc.createWindow()

  window.route = false

  window.console.log = ->
    args = Array.prototype.slice.call arguments, 0
    args.unshift 'client:'.blue
    console.log.apply console, args

  window.alert = window.console.log
  window.XDomainRequest = XMLHttpRequest
  window.XMLHttpRequest = XMLHttpRequest
  window.localStorage = {}
  window.Date = Date
  window.Array = Array
  window.Number = Number
  window.JSON = JSON
  window.conf = opt.conf

  window.window = window

  files = new depends.Files()

  files.js = {}
  for file, content of cache
    if /\.js$/.test(file) and file != '/main.js'
      files.js[file] = content

  dep = new depends.NodeDep files, context: window, init: 'hs.urls'

  zz = "#{opt.conf.zz.server.protocol}://#{opt.conf.zz.server.host}:#{opt.conf.zz.server.port}/api-library.js"

  dep.dlIntoContext zz, (err)->
    return clbk err if err?
    dep.execute 'hs.urls', clbk


#route
exports.route = (pathname, clbk) ->
  html = '<!DOCTYPE html>'

  try
    for exp, Template of dep.context.hs.urls

      parsed = new RegExp(exp).exec(pathname)
      if parsed?

        kwargs =
          pathname: pathname
          parsedUrl: parsed.slice(1)

        break if Template.prototype.authRequired

        Template.get kwargs, (t) ->
          return clbk 404, '' if not t?

          html += dep.context.document.innerHTML
          clbk null, html
          t.remove()
        return

    html += dep.context.document.innerHTML
    clbk 404, html

  catch e
    console.log ('error'+e.stack).red
    html += dep.context.document.innerHTML
    clbk 500, html
