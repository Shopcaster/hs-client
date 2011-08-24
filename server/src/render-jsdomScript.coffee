
depends = require 'depends'
jsdom  = require("jsdom").jsdom
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
fs = require 'fs'
request = require 'request'
require 'colors'

# module vars
dep = null
cache = null
window = null

# initialize
exports.init = (c, opt, clbk)->
  cache = c

  files = new depends.Files()

  files.js = {}
  for file, content of cache
    files.js[file] = content if /\.js$/.test file

  files.parse =>
    return clbk err if err?
    files.clean()

    html = cache.cleanIndex

    for script in files.dependsOn 'hs.urls'
      html = html.replace '</body>', "<script> #{cache[files.map[script]]}; </script> </body>"

    jsdom.env
      html: html
      done: (errors, w)=>
        return clbk errors if errors? and errors.length

        window = w
        console.log window.document.innerHTML
        clbk()


#route
exports.route = (pathname, clbk) ->
  console.log 'window.hs', window.hs
  html = '<!DOCTYPE html>'

  e404 = -> use window.hs.t.e404, [], 404

  use = (Template, parsedUrl, status=200)->
    Template.get pathname: pathname, parsedUrl: parsedUrl, (t) ->
      return e404() if not t?

      html += window.document.innerHTML
      clbk status, html
      t.remove()
      dep.context.$('#main').html('')


  try
    for exp, Template of window.hs.urls

      parsed = new RegExp(exp).exec(pathname)
      if parsed?
        break if Template.prototype.authRequired

        use Template, parsed.slice(1)
        return

    e404()

  catch e
    console.log ('error'+e.stack).red
    html += window.document.innerHTML
    clbk 500, html
