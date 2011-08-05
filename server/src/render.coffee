
depends = require 'depends'
jsdom  = require("jsdom").jsdom
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
fs = require 'fs'
require 'colors'

# module vars
dep = null
id = 1


# initialize
exports.init = (opt, clbk)->
  fs.readFile opt.build+'/index.html', 'utf8', (err, index)->
    return clbk err if err?

    zz = "#{opt.conf.zz.server.protocol}://#{opt.conf.zz.server.host}:#{opt.conf.zz.server.port}/api-library.js"

    doc = jsdom index, null,
      features:
        FetchExternalResources: false

    window = doc.createWindow()

    window.route = false
    window.alert = -> console.log.apply console, arguments
    window.console = console
    window.XDomainRequest = XMLHttpRequest
    window.XMLHttpRequest = XMLHttpRequest
    window.localStorage = {}
    window.Date = Date
    window.Array = Array
    window.Number = Number
    window.JSON = JSON
    window.conf = opt.conf

    window.window = window

    depends.manageNode
      src: opt.build+'/js'
      context: window
      init: 'hs.urls'
      ,(err, nodeDep)->
        return clbk err if err?

        dep = nodeDep

        dep.dlIntoContext zz, (err)->
          return clbk err if err?

          dep.execute 'hs.urls', ->
            clbk()


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
