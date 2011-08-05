
_ = require('underscore')._
fs = require 'fs'
require 'colors'


compile = (files, opt, cache, clbk) ->

  manifestFilename = '/manifest.appcache'
  manifest = ''

  manifest += 'CACHE MANIFEST\n'

  if opt.noappcache
    manifest += 'NETWORK:\n*\n'
    cache[manifestFilename] = manifest
    return clbk()

  console.log 'building appcache'.magenta

  getModTime opt.src, (err, time)->
    return clbk err if err?

    manifest += "#built: #{time}\n\n"

    manifest += 'NETWORK:\n*\n\n'

    manifest += 'CACHE:\n';

    for file, content of cache
      manifest += file+'\n'

    cache[manifestFilename] = manifest
    clbk()


getModTime = (path, mainClbk)->

  getTimes = (path, times, clbk)->
    fs.stat path, (err, stats)->
      return clbk err if err?

      if stats.isDirectory()
        fs.readdir path, (err, files)->
          return clbk err if err?

          done = _.after files.length, clbk

          for file in files
            getTimes path+'/'+file, times, done

      else
        times.push stats.mtime.getTime()
        clbk()

  times = []
  getTimes path, times, (err)->
    return mainClbk err if err?
    times.sort (a, b) -> b - a
    mainClbk null, times[0]


exports.compile = compile
