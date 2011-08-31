
require 'colors'
depends = require 'depends'
jsdom  = require("jsdom").jsdom
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
fs = require 'fs'
gzip = require 'gzip'
contextify = require 'contextify'
request = require 'request'

# module vars
#dep = null
cache = null
opt = null
files = null

zzContext = {}
zzContext.XMLHttpRequest = XMLHttpRequest
zzContext.XMLHttpRequest.prototype.withCredentials = true
zzContext.addEventListener = ->
zzContext.setTimeout = setTimeout
zzContext.clearTimeout = clearTimeout
zzContext.console = console
zzContext.localStorage = {}

zzContext.Date = Date
zzContext.String = String
zzContext.Number = Number

zzContext = contextify zzContext
zzContext.window = zzContext.getGlobal()

exports.ready = false

# initialize
exports.init = (c, o, clbk)->
  cache = c
  opt = o

  files = new depends.Files()

  files.js = {}
  for file, content of cache
    if /\.js$/.test(file) and file != '/main.js'
      files.js[file] = content

  request url: "#{opt.serverUri}/api-library.js", (err, res, body)=>
    return clbk err if err?

    try
      zzContext.run body, "#{opt.serverUri}/api-library.js"
    catch e
      console.log 'Error in zz:'.red
      console.log e.stack

    exports.ready = true
    clbk?()



#route
exports.route = (pathname, clbk) ->
  window = jsdom cache['/index.html'], null,
    features:
      FetchExternalResources: false
      ProcessExternalResources: false
      MutationEvents: false

  window = window.createWindow()

  window.route = false
  window.conf = opt

  window.Date = Date
  window.String = String
  window.Number = Number

  window.console.log = window.console.error = ->
    args = Array.prototype.slice.call arguments, 0
    args.unshift 'client:'.blue
    console.log.apply console, args

  window.alert = window.console.log

  window.zz = zzContext.zz

  window.dep = require: (->), provide: (mod)->
    split = mod.split('.')
    cur = window
    cur = cur[split.shift()] ||= {} while split.length

  for mod in files.dependsOn 'hs.urls'
    file = files.rawMap[mod]
    content = files.js[file]
    window.run content, file


  html = '<!DOCTYPE html>'

  use = (Template, parsedUrl, status=200)->
    Template.get pathname: pathname, parsedUrl: parsedUrl, (t) ->
      return e404() if not t?

      html += window.document.innerHTML

      clbk status, html

      window.hs = null
      window.close()

      #t.remove()
      #t = null
      #dep.context.$('#main').html('')

  e404 = -> use window.hs.t.e404, [], 404

  try
    for exp, Template of window.hs.urls

      parsed = new RegExp(exp).exec(pathname)
      if parsed?
        break if Template.prototype.authRequired

        use Template, parsed.slice(1)
        return

    e404()

  catch e
    console.log ('error '+ (e.stack || e)).red
    #html += window.document.innerHTML
    clbk 500, 'we suck'
