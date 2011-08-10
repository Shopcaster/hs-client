
exec = require('child_process').exec
require 'colors'


compile = (files, opt, cache, clbk) ->

  scss = false
  for file in files
    if /\.scss$/.test file
      scss = true
      break

  return clbk() if not scss

  console.log 'building scss'.magenta

  exec "sass #{opt.src}/css/style.scss", (err, stdout, stderr)->
    return clbk err.stack if err?
    return clbk strerr if stderr? and stderr != ''
    cache['/style.css'] = stdout

    clbk()


exports.compile = compile
