
coffee = require 'coffee-script'
fs = require 'fs'
require 'colors'


compile = (files, opt, cache, clbk) ->

  coff = []
  for file in files
    coff.push file if /\.coffee$/.test file

  return clbk() if coff.length == 0

  console.log 'building coffee'.magenta

  do next = ->
    return clbk() if not (file = coff.pop())?

    fs.readFile file, 'utf8', (err, content) ->
      return clbk err if err?

      try
        js = coffee.compile content
      catch e
        return clbk e

      name = file.replace(opt.src, '').replace(/\.coffee$/, '.js')
      cache[name] = js
      next()


exports.compile = compile
