
dep.require 'hs.Dom'
dep.require 'hs.Template'


class hs.t.Listing extends hs.Template

  template: ->
    div class: 'listing clearfix', ->

      div class: 'section-left', ->
        div id: 'listing-image', -> img()
        div id: 'listing-messsages', ->
          div class: 'message-button', -> 'Ask A Question'

      div class: 'section-right', ->
        div id: 'listing-details', ->
          div id: 'listing-creator'
          div id: 'listing-status', -> span class: 'status'
          div id: 'listing-description'
          div id: 'created'
          div class: 'bottom', ->
            div id: 'listing-social', ->
              div class: 'twitter'
              div class: 'goog'
              div class: 'fb'

            div id: 'listing-local-diff'

            a href: 'javascript:;', class: 'map-link', target: '_blank', ->
              img class: 'map'

            div id: 'listing-offerbar', class: 'clearfix', ->

              div class: 'left', ->
                div class: 'title', -> 'Asking Price'
                div class: 'value asking', -> '$0'
                div class: 'details asking'
              div class: 'middle', ->
                div class: 'title', -> 'Best Offer'
                div class: 'value best-offer', -> '$0'
                div class: 'details best-offer'
              div class: 'right', ->
                div class: 'title', -> 'My Offer'
                div class: 'value my-offer', -> '$0'
                div class: 'details my-offer'

        div class: 'offer-form-wrapper', ->
          div class: 'button offer-button', -> 'Make and Offer'

        div id: 'listing-inquiries', -> h2 -> 'Frequently Asked Questions'


  subTemplates:
    user:
      class: hs.t.User
      appendTo: '#listing-creator'

    inquiries:
      class: hs.t.Inquiries
      appendTo: '#listing-inquiries'


  postRender: ->
    this.inquiriesTmpl model: this.model

    this.$('.twitter').html '
      <a href="http://twitter.com/share"
         class="twitter-share-button"
         data-count="horizontal"
         data-via="hipsellapp"
         data-text="Check out this awesome item for sale on Hipsell. Snap it up before it\'s too late.">
          Tweet
      </a>
      <script src="http://platform.twitter.com/widgets.js"></script>'

    this.$('.fb').html "
      <iframe src=\"http://www.facebook.com/plugins/like.php?app_id=105236339569884&amp;href=http%3A%2F%2Fhipsell.com/#!/listings/#{this.model._id}/&amp;href&amp;send=false&amp;layout=standard&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;width=200&amp;height=30\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; width:200px; height:30px;\" allowTransparency=\"true\"></iframe>"

    this.$('.goog').html '
      <script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script>
      <g:plusone size="medium" count="true"></g:plusone>'

    if Modernizr.geolocation
      navigator.geolocation.getCurrentPosition _.bind(this.updateLocation, this)

    hs.setMeta 'og:title', 'Listing at Hipsell'
    hs.setMeta 'og:type', 'product'
    hs.setMeta 'og:url', window.location.toString()
    hs.setMeta 'og:site_name', 'Hipsell'
    hs.setMeta 'fb:app_id', '110693249023137'


  setCreator: () ->
    this.userTmpl model: this.model.creator


  setPhoto: () ->
    url = "http://#{conf.server.host}:#{conf.server.port}/static/#{this.model.get('photo')}"
    this.$('#listing-image > img').attr 'src', url


  setDesc: () ->
    this.$('#listing-description').text this.model.description
    $('title').text "Hipsell - #{this.model.description}"
    hs.setMeta 'og:description', this.model.description


  setCreated: () ->
    since = _.since this.model.created
    this.$('.created').text "#{since.num} #{since.text}"


  updateLoc: () ->

    lat = this.model.latitude
    lng = this.model.longitude

    this.$('img.map').attr 'src',
      "http://maps.google.com/maps/api/staticmap?center=#{lat},#{lng}&zoom=14&size=450x100&sensor=false"

    this.$('.mapLink').attr 'href',
      "http://maps.google.com/?ll=#{lat},#{lng}&z=16"

    hs.setMeta 'og:latitude', lat
    hs.setMeta 'og:longitude', lng

    if this.userLat? and this.userLng?
      this.updateLocation()


  updateLocation: (position) ->
    if this.model.latitude? and this.model.longitude?

      this.lat ?= position.coords.latitude
      this.lng ?= position.coords.longitude

      listingLoc = new LatLon this.model.get('latitude'), this.model.get('longitude')
      userLoc = new LatLon this.lat, this.lng

      dist = parseFloat userLoc.distanceTo listingLoc
      brng = userLoc.bearingTo listingLoc

      direction = _.degreesToDirection brng

      if dist < 1
        distStr = Math.round(dist*1000)+' metres'
      else
        distStr = Math.round(dist*100)/100+' km'

      this.$('#listing-locDiff').text "Roughly #{distStr} #{direction} of you."


  updatePrice: () ->
    this.$('.asking.value').text "$#{this.model.price}"


  updateOffers: () ->
    this.model.bestOffer (best) => if best?
      node = this.$('.best-offer.value')

      node.text "$#{best.amount}"

      node.animate {color: '#828200'}, 250, () ->
        node.animate {color: '#008234'}, 250


    this.model.myOffer (offer) => if offer?
      node = this.$('.my-offer.value')

      node.text "$#{offer.amount}"

      node.animate {color: '#828200'}, 250, () ->
        node.animate {color: '#008234'}, 250
