
depends = require 'depends'
jsdom = require 'jsdom'
fs = require 'fs'

exports.run = (opt, res) ->

  fs.readFile opt.build+'/index.html', 'utf8', (err, index)->
    throw err if err?

    zz = "#{opt.conf.zz.server.protocol}://#{opt.conf.zz.server.host}:#{opt.conf.zz.server.port}/api-library.js"

    console.log 'zz', zz

    jsdom.env
      html: index
      scripts: [zz]
      done: (err, window)->
        throw err if err

        console.log 'window.zz', window.zz

        window.route = false

        depends.manageNode opt.build+'/js', window, (err, dep)->
          throw err if err?

          dep.context.renderFinished = (dom) ->
            res.writeHead 200, 'Content-Type': 'text/html'
            res.write dom
            res.end()

          dep.inContext ->
            dep.require 'hs.urls'

            for exp, Template of hs.urls
              parsed = new RegExp(exp).exec(url)
              if parsed?
                kwargs =
                  pathname: pathname
                  parsedUrl: parsed.slice(1)

                break if Template.prototype.authRequired

                Template.get kwargs, (template) ->
                  return if not template?

                  renderFinished document.documentElement.innerHTML

                break
