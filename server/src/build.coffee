
_ = require('underscore')._
fs = require 'fs'


compilers = [
  require './compilers/coffee'
  require './compilers/scss'
  require './compilers/static'
  require './compilers/html'
]


build = (files, opt, cache, clbk) ->
  do next = (err) ->
    return clbk err if err?

    return clbk() if not (compiler = compilers.shift())
    compiler.compile files, opt, cache, next



buildDir = (dir, opt, cache, clbk) ->
  listDir dir, (err, files)->
    return clbk err if err?
    build files, opt, cache, clbk


listDir = (dir, clbk)->
  result = []

  fs.readdir dir, (err, files)->
    return clbk err if err?

    do next = (err)->
      return clbk err if err?

      return clbk null, result if not (file = files.pop())

      file = dir+'/'+file

      fs.stat file, (err, stat)->
        return clbk err if err?

        if stat.isDirectory()
          listDir file, (err, subResult)->
            return clbk err if err?
            result = result.concat subResult
            next()

        else
          result.push file
          next()


exports.build = build
exports.buildDir = buildDir
