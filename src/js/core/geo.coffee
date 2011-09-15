
dep.require 'hs.t.Error'

dep.provide 'hs.geo'

hs.geo =

  get: (clbk)->

    # Success callback
    success = ->
      # Pass on through to the callback
      clbk.apply this, arguments

    # Error callback
    error = (err) ->
      # Clear the error template
      if hs.geo.errorTemplate?
        hs.geo.errorTemplate.remove()

      # Choose the error message based on the error code
      if err.code == 1
        msg = 'Turn on location to get the full Hipsell experience.'
      else
        msg = 'We can\'t figure out your location, so some things might
               not work perfectly.  Sorry about that.'

      # Display the error message
      hs.geo.errorTemplate = new hs.t.Error null, message: msg

      # Fall back to IP geolocation
      dogeo()

    # Does an IP geolocation
    dogeo = ->

      # Our IP geo functionality currently can't call the error
      # callback, so we don't have to include it.
      hs._ipgeo.getCurrentPosition success


    # If we have the geolocation API available to us, use it.  The
    # fallback for it is IP geolocation.
    if navigator.geolocation?
      navigator.geolocation.getCurrentPosition(success, error)
    else
      dogeo()


# IP-based geolocation
hs._ipgeo =
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
    $.getJSON 'http://freegeoip.net/json/?callback=?', (data) ->
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

# If the native geolocation API isn't available, patch in IP geo in
# its place.
navigator.geolocation ||= hs._ipgeo
