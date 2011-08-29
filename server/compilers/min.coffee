
ug = require 'uglify-js'
fs = require 'fs'
depends = require 'depends'
require 'colors'


compile = (files, opt, cache, clbk) ->

  return clbk() if not opt.minifyJS and not opt.concatJS

  console.log 'minifying js'.magenta

  files = new depends.Files()

  files.js = {}
  for file, content of cache
    files.js[file] = content if /\.js$/.test file

  files.getClient false, (err, loader) ->
    return clbk err if err?

    js = ''
    js += loader

    for file in files.output
      js += files.js[file]

    if opt.minifyJS
      ast = ug.parser.parse js
      ast = ug.uglify.ast_mangle ast, toplevel: true
      ast = ug.uglify.ast_squeeze ast
      js = ug.uglify.gen_code ast,
        indent_level: 2

    cache['/main.js'] = js

    clbk()


exports.compile = compile
