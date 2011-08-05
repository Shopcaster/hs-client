cli = require('cli')
fs = require('fs')
_ = require('underscore')._
serve = require './serve'


cli.parse

  #options
  src: ['s', 'Source directory', 'path', './src']

  #server
  host:  ['h', 'Address to serve on', 'string', '0.0.0.0']
  port:  ['p', 'Serve on port', 'number', 3000]

  autobuild:  ['a', 'Automatically rebuild on file change', 'boolean', false]


  #builder
  noappcache: ['n', 'Disable HTML5 Application Cache', 'boolean', false]
  jsconf: ['c', 'JSON config file', 'path', './localConf.json']

  concat: [false, 'Connatinate js info one file', 'boolean', false]
  minify: ['m', 'Minify JS using Uglify JS', 'boolean', false]
  pretify: ['p', 'Pretify minified JS using Uglify JS', 'boolean', false]

  ##TODO:
  #test: ['t', 'Build js with tests', 'boolean', false]


cleanOpt = (opt, clbk)->

  opt.concat = true if opt.minify

  fs.realpath opt.src, (err, srcPath)->
    cli.fatal err if err?
    opt.src = srcPath

    fs.readFile opt.src+'/conf.json', 'utf8', (err, data)->
      cli.fatal err if err?

      fs.readFile opt.jsconf, 'utf8', (err, localData)->
        cli.fatal err if err?

        opt.conf = _.extend({}, JSON.parse(data), JSON.parse(localData))
        clbk opt


cli.main (args, opt)->
  if (opt.silent) then cli.status = ->
  cleanOpt opt, (opt)-> serve.run(opt)
