
fs = require 'fs'


compile = (files, opt, cache, clbk) ->

  img = []
  for file in files
    ext = /\.(\w+)$/.exec(file)[1]
    if ext in ['png', 'jpg', 'jpeg', 'gif']
      img.push file

  do next = ->
    return clbk() if not (file = img.pop())?

    fs.readFile file, (err, content) ->
      return clbk err if err?
      cache[file.replace opt.build, ''] = content
      next()


exports.compile = compile
