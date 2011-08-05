
ug = require 'uglify-js'
fs = require 'fs'
require 'colors'


compile = (files, opt, cache, clbk) ->

  return clbk() if not opt.minify

  console.log 'uglifying js'.magenta

  js = {}
  for file in cache
    coff.push file if /\.coffee$/.test file

  return clbk() if coff.length == 0


  do next = ->
    return clbk() if not (file = coff.pop())?

    fs.readFile file, 'utf8', (err, content) ->
      return clbk err if err?

      try
        js = coffee.compile content
      catch e
        return clbk 'coffee error in file: '+file+'\n'+e

      name = file.replace(opt.src, '').replace(/\.coffee$/, '.js')
      cache[name] = js
      next()


exports.compile = compile
