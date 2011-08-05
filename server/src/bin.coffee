cli = require('cli')
fs = require('fs')
_ = require('underscore')._
serve = require './serve'


cli.parse

  #options
  src: ['s', 'Source directory', 'path', './src']

  verbose: ['v', 'Print more', 'boolean', false]
  silent: ['s', 'stop output', 'boolean', false]


  #server
  host:  ['a', 'Address to serve on', 'string', '0.0.0.0']
  port:  ['p', 'Serve on port', 'number', 3000]

  autobuild:  [false, 'Automatically rebuild on file change', 'boolean', false]


  #builder
  noappcache: [false, 'Disable HTML5 Application Cache', 'boolean', false]
  jsconf: ['c', 'JSON config file', 'path', './localConf.json']
  test: ['t', 'Build js with tests', 'boolean', false]
  minify: ['m', 'Minify JS using Uglify JS', 'boolean', false]
  pretify: ['p', 'Pretify minified JS using Uglify JS', 'boolean', false]


cleanOpt = (opt, clbk)->
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
