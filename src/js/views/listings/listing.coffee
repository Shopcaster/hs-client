
dep.require 'hs.View'

dep.provide 'hs.v.Listing'

class hs.v.Listing extends hs.View

  init: ->
    this.template.$('#listing-social .twitter').html '
      <a href="http://twitter.com/share"
         class="twitter-share-button"
         data-count="none"
         data-via="hipsellapp"
         data-text="Check out this awesome item for sale on Hipsell. Snap it up before it\'s too late.">
          Tweet
      </a>
      <script src="http://platform.twitter.com/widgets.js"></script>'


    this.template.$('#listing-social .fb').html "
      <iframe
        src='http://www.facebook.com/plugins/like.php?app_id=105236339569884&amp;href=#{encodeURIComponent(document.location.href)}&amp;send=false&amp;layout=standard&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;width=53&amp;height=24'
        scrolling='no'
        frameborder='0'
        style='border:none; overflow:hidden; width:53px; height:24px;'
        allowTransparency='true'>
      </iframe>"

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
