
fs = require 'fs'
require 'colors'

exts = ['png', 'jpg', 'jpeg', 'gif', 'js']

compile = (files, opt, cache, clbk) ->

  matching = []
  for file in files
    ext = /\.(\w+)$/.exec(file)[1]
    if ext in exts
      matching.push file

  return clbk() if matching.length == 0

  console.log 'building static'.magenta

  do next = ->
    return clbk() if not (file = matching.pop())?

    fs.readFile file, (err, content) ->
      return clbk err if err?
      cache[file.replace opt.src, ''] = content
      next()


exports.compile = compile