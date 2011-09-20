
dep.require 'hs.View'

dep.provide 'hs.v.Listing'

class hs.v.Listing extends hs.View

  events:
    'click #listing-social .fb': 'fb'
    'click #listing-social .twitter': 'twitter'

  init: ->
    gapi.plusone.render this.template.$('#listing-social .goog')[0],
      size: 'medium'
      annotation: 'none'

    hs.geo.get => (position) ->
      this.lat ?= position.coords.latitude
      this.lng ?= position.coords.longitude

      if this.template.model.location?
        listingLoc = new LatLon this.template.model.location[0], this.template.model.location[1]
      else
        listingLoc = new LatLon this.template.model.latitude, this.template.model.longitude

      userLoc = new LatLon this.lat, this.lng

      dist = parseFloat userLoc.distanceTo listingLoc
      brng = userLoc.bearingTo listingLoc

      direction = brng.degreesToDirection()

      if dist < 1
        distStr = Math.round(dist*1000)+' metres'
      else
        distStr = Math.round(dist*100)/100+' km'

      this.template.$('#listing-loc-diff').html "Roughly #{distStr} #{direction} of you &ndash; "


  fb: (e)->
    e.preventDefault();

    url = 'http://www.facebook.com/dialog/feed?'
    args =
      'app_id': '110693249023137'
      'redirect_uri': "#{conf.clientUri}/special/close"
      'display': 'popup'
      'link': document.location.href
      'name': 'Hipsell item for sale'
      'picture': "#{conf.serverUri}/#{this.template.model.photo}"
      'description': this.template.model.description

    url += k+'='+encodeURIComponent(v)+'&' for k, v of args

    fb = window.open url, 'Share on Facebook', 'height=400,width=580'
    fb.focus() if window.focus


  twitter: (e)->
    e.preventDefault();

    url = 'https://twitter.com/intent/tweet?'
    args =
      'url': document.location.href
      'via': 'hipsellapp'
      'text': 'Check out this awesome item for sale on Hipsell. '+
          'Snap it up before it\'s too late.'
      'related': 'hipsellapp'

    url += k+'='+encodeURIComponent(v)+'&' for k, v of args

    fb = window.open url, 'Share on Twitter', 'height=400,width=580'
    fb.focus() if window.focus
