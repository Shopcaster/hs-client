
coffee = require 'coffee-script'
fs = require 'fs'


compile = (files, opt, cache, clbk) ->

  coffee = []
  coffee.push file if /\.coffee$/.test file for file in files

  return clbk() if coffee.length = 0

  do next = ->
    return clbk() if not (file = coffee.pop())?

    fs.readFile file, 'utf8', (err, content) ->
      return clbk err if err?

      try
        js = coffee.compile content
      catch e
        return clbk e

      cache[file.replace opt.src, ''] = js
      next()


exports.compile = compile
