
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

# Patch in IP-based geolocation if it's not present
navigator.geolocation ||=
  getCurrentPosition: (success, error) ->
    # Cache super aggresively
    return success(navigator.geolocation._cache) if navigator.geolocation._cache

    # Similarly, if a request for geolocation is already underway
    # we should just add to the callbacks.
    navigator.geolocation._callbacks ||= []
    navigator.geolocation._callbacks.push success
    # Note that we can't actually handle failure, so we don't
    # bother worrying about that callback.

    # Fire the JSONP
    s = navigator.geolocation._req = document.createElement('script')
    s.src = 'http://freegeoip.net/json/?callback=navigator.geolocation._pclbk'
    document.getElementsByTagName('head')[0].appendChild(s)

  # The JSONP callback function
  _pclbk: (data) ->
    # Update the cache
    navigator.geolocation._cache =
      timestamp: new Date()
      coords:
        # Set lat/long
        latitude: parseFloat data.latitude
        longitude: parseFloat data.longitude
        # Make up an accuracy
        accuracy: 10 * 1000 # 10 km seems ok?

        # Unfortunately, we only have access to lat/long, so we
        # have to set the other fields to null to conform to the
        # spec.
        altitude: null
        altitudeAccuracy: null
        heading: null
        speed: null

    # Fire all the callbacks
    for clbk in navigator.geolocation._callbacks
      clbk(navigator.geolocation._cache)


