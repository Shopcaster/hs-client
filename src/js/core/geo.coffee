
dep.require 'hs.t.Error'

dep.provide 'hs.geo'

hs.geo =

  get: (clbk)->
    if navigator.geolocation?
      navigator.geolocation.getCurrentPosition(
          hs.geo._success(clbk),
          hs.geo._error(clbk))

  _success: (clbk)->->
    if hs.geo.errorTemplate?
      hs.geo.errorTemplate.remove()

    clbk.apply this, arguments

  _error: (clbk)-> (err)->
    if err.code = 1
      msg = 'Turn on location to get the full Hipsell experience.'

    else
      msg = 'We can\'t figure out your location,
        so some things might not work perfectly. Sorry about that.'

    if hs.geo.errorTemplate?
      hs.geo.errorTemplate.remove()

    hs.geo.errorTemplate = new hs.t.Error null, message: msg

