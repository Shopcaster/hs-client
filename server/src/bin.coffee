cli = require('cli')
fs = require('fs')
_ = require('underscore')._
serve = require './serve'


cli.parse

  settings: ['t', 'JSON config file or predefined mode', 'path', './lsettings.json']

  #options
  clientSource: ['s', 'Source directory', 'path']
  clientUri:  ['u', 'Address to serve on', 'string']

  autobuild:  ['b', 'Automatically rebuild on file change', 'boolean']
  prerender:  ['r', 'Prerender pages before serving', 'boolean']

  #builder
  appcache: ['a', 'HTML5 Application Cache', 'boolean']

  concat: ['c', 'Connatinate js info one file', 'boolean']
  minify: ['m', 'Minify JS using Uglify JS', 'boolean']

  ##TODO:
  #test: ['t', 'Build js with tests', 'boolean', false]


mash = (objs...)->
  res = {}
  for obj in objs
    for own key, val of obj
      res[key] = val if val?
  return res

cleanOpt = (opt, clbk)->
  opt.concat = true if opt.minify

  settings = fs.readFileSync __dirname+'/../settings.json', 'utf8'
  settings = JSON.parse settings

  if opt.settings in Object.keys settings
    settings = mash settings.default, settings[opt.settings], opt

  else if fs.statSync(opt.settings).isFile()
    lsettings = fs.readFileSync opt.settings, 'utf8'
    lsettings = JSON.parse lsettings

    settings = mash settings.default, lsettings, opt

  delete settings.settings

  clbk settings


cli.main (args, opt)->
  if (opt.silent) then cli.status = ->
  cleanOpt opt, (opt)-> serve.run(opt)


