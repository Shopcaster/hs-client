
depends = require 'depends'
jsdom  = require("jsdom").jsdom
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
fs = require 'fs'
require 'colors'

# module vars
dep = null
cache = null

exports.ready = false

# initialize
exports.init = (c, opt, clbk)->
  cache = c

  window = jsdom(cache.cleanIndex).createWindow()

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
  window.conf = opt

  files = new depends.Files()

  files.js = {}
  for file, content of cache
    if /\.js$/.test(file) and file != '/main.js'
      files.js[file] = content

  dep = new depends.NodeDep files, context: window, init: 'hs.urls'

  dep.dlIntoContext "#{opt.serverUri}/api-library.js", (err)->
    return clbk err if err?
    dep.execute 'hs.urls', ->
      exports.ready = true
      clbk?()


#route
exports.route = (pathname, clbk) ->
  html = '<!DOCTYPE html>'

  e404 = -> use dep.context.hs.t.e404, [], 404

  use = (Template, parsedUrl, status=200)->
    console.log 'using', Template.name
    Template.get pathname: pathname, parsedUrl: parsedUrl, (t) ->
      console.log 'done'
      return e404() if not t?

      html += dep.context.document.innerHTML
      clbk status, html
      t.remove()
      dep.context.$('#main').html('')


  try
    for exp, Template of dep.context.hs.urls

      parsed = new RegExp(exp).exec(pathname)
      if parsed?
        break if Template.prototype.authRequired

        use Template, parsed.slice(1)
        return

    e404()

  catch e
    console.log ('error'+e.stack).red
    html += dep.context.document.innerHTML
    clbk 500, html
