
depends = require 'depends'
jsdom  = require("jsdom").jsdom
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
fs = require 'fs'
gzip = require 'gzip'
contextify = require 'contextify'
parseUrl = require('url').parse
request = require 'request'


#TODO set these
cache = {}
opt = null
pathname = process.argv[2]
buffer = ''

process.stdin.setEncoding 'utf8'
process.stdin.on 'data', (chunk)-> buffer += chunk

process.stdin.resume()


process.stdin.on 'end', ->

  for chunk in buffer.split '==========\n'
    chunk = chunk.split('\n')
    top = chunk.shift()
    chunk = chunk.join '\n'

    if top != '===conf==='
      cache[top] = chunk
    else
      opt = JSON.parse chunk

  opt._render = true

  files = null

  window = jsdom cache['/index.html'], null,
    features:
      FetchExternalResources: false
      ProcessExternalResources: false
      MutationEvents: false

  window = window.createWindow()

  window.route = false
  window.conf = opt

  window.XMLHttpRequest = XMLHttpRequest
  window.XMLHttpRequest.prototype.withCredentials = true
  window.addEventListener = ->
  window.setTimeout = setTimeout
  window.clearTimeout = clearTimeout
  window.localStorage = {}
  window.location = parseUrl opt.clientUri+pathname
  window.location.toString =-> opt.clientUri+pathname

  window.window = window.getGlobal()

  files = new depends.Files()

  files.js = {}
  for file, content of cache
    if /\.js$/.test(file) and file != '/main.js'
      files.js[file] = content

  request url: "#{opt.serverUri}/api-library.js", (err, res, body)=>
    return throw err if err?

    try
      window.run body, "#{opt.serverUri}/api-library.js"
    catch e
      console.error 'Error in zz:'
      console.error e.stack
      process.exit()

    window.alert = window.console.log = window.console.error = ->
      # uncomment for logging
      #console.error.apply console, arguments

    window.dep = require: (->), provide: (mod)->
      split = mod.split('.')
      cur = window
      cur = cur[split.shift()] ||= {} while split.length

    for mod in files.dependsOn 'hs.urls'
      file = files.rawMap[mod]
      content = files.js[file]
      window.run content, file

    html = '<!DOCTYPE html>'


    finish = (content)->
      if not process.stdout.write content
        process.stdout.on 'drain', ->
          process.stdout.end()
          process.exit()
      else
          process.stdout.end()
          process.exit()


    use = (Template, parsedUrl, status=200)->

      window.zz.waitThreshold = 0

      Template.get pathname: pathname, parsedUrl: parsedUrl, ->

        window.zz.ping()
        window.zz.on 'done', ->
          html += window.document.innerHTML
          finish html


    window.$ -> window.zz.init ->
      window.hs.globalViews = []
      user = window.zz.auth.curUser()

      for Tmpl, i in window.hs.globalTemplates
        window.hs.globalTemplates[i] = new Tmpl()
        window.hs.globalTemplates[i].authChange null, user

        View = window.hs.v[Tmpl.getName()] or window.hs.View
        window.hs.globalViews[i] = new View(window.hs.globalTemplates[i])

      try
        for exp, Template of window.hs.urls

          parsed = new RegExp(exp).exec(pathname)
          if parsed?
            if Template.prototype.authRequired
              html += window.document.innerHTML
              finish html
              return

            use Template, parsed.slice(1)
            return

        use window.hs.t.e404, [], 404

      catch e
        console.error ('error '+ (e.stack || e)).red

