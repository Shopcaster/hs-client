
exec = require('child_process').exec


compile = (files, opt, cache, clbk) ->

  scss = []
  scss.push file if /\.scss$/.test file for file in files

  return clbk() if scss.length = 0

  do next = ->
    return clbk() if not (file = scss.pop())?

    exec "sass #{file}", (err, stdout, stderr)->
      return clbk err if err?
      cache[file.replace opt.src, ''] = stdout
      next()


exports.compile = compile
