
dep.require 'hs.Template'
dep.require 'zz'
dep.require 'hs.t.User'
dep.require 'hs.t.Inquiries'
dep.require 'hs.t.Convo'
dep.require 'hs.t.ConvoList'
dep.require 'hs.t.OfferForm'

dep.provide 'hs.t.Listing'


class hs.t.Listing extends hs.Template

  appendTo: '#main'

  template: ->
    div class: 'listing clearfix', ->

      div class: 'section-left', ->
        div id: 'listing-image', -> img()
        div id: 'listing-messages', ->
          div class: 'message-button', -> 'Ask A Question'

      div class: 'section-right', ->
        div id: 'listing-details', ->
          div id: 'listing-creator'
          span class: 'status', => 'Available'
          div id: 'listing-description'
          div id: 'created'
          div class: 'bottom', ->
            div id: 'listing-social', ->
              div class: 'twitter'
              div class: 'goog'
              div class: 'fb'

            div id: 'listing-loc-diff'

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

    convo:
      class: hs.t.Convo
      appendTo: '#listing-messages'

    convoList:
      class: hs.t.ConvoList
      appendTo: '#listing-messages'

    offerForm:
      class: hs.t.OfferForm
      appendTo: '.offer-form-wrapper'


  postRender: ->
    this.model.relatedInquiries (inquiries) =>
      this.inquiriesTmpl inquiries

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

    this.meta property: 'og:title', content: 'Listing at Hipsell'
    this.meta property: 'og:type', content: 'product'
    this.meta property: 'og:url', content: window.location.toString()
    this.meta property: 'og:site_name', content: 'Hipsell'
    this.meta property: 'fb:app_id', content: '110693249023137'


  setAuth: (prev, cur) ->
    this.convoTmpl.remove()
    this.convoListTmpl.remove()
    this.offerFormTmpl.remove()

    if cur? and this.model.creator == cur._id
      this.model.relatedConvos this.convoListTmpl
      this.$('.offer-button').hide()

    else
      this.model.myConvo (convo) =>
        this.convoTmpl convo, listing: this.model

      this.$('.offer-button').show()
      this.model.myOffer (offer) =>
        this.offerFormTmpl offer, listing: this.model


  setCreator: () ->
    zz.data.user this.model, 'creator', (creator) =>
      this.userTmpl creator


  setPhoto: () ->
    url = "http://#{conf.zz.server.host}:#{conf.zz.server.port}/static/#{this.model.photo}"
    this.$('#listing-image > img').attr 'src', url


  setDescription: () ->
    this.$('#listing-description').text this.model.description
    $('title').text "Hipsell - #{this.model.description}"
    this.meta property: 'og:description', content: this.model.description


  setCreated: () ->
    since = _.since this.model.created
    this.$('.created').text "#{since.num} #{since.text}"


  setPrice: () ->
    this.$('.asking.value').text "$#{this.model.price}"


  setOffers: () ->
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


  setLongitude: -> this.setLocation.apply this, arguments
  setLatitude: -> this.setLocation.apply this, arguments
  setLocation: () ->
    lat = this.model.latitude
    lng = this.model.longitude

    this.$('img.map').attr 'src',
      "http://maps.google.com/maps/api/staticmap?center=#{lat},#{lng}&zoom=14&size=450x100&sensor=false"

    this.$('.mapLink').attr 'href',
      "http://maps.google.com/?ll=#{lat},#{lng}&z=16"

    this.meta property: 'og:latitude', content: lat
    this.meta property: 'og:longitude', content: lng

    if Modernizr.geolocation
      navigator.geolocation.getCurrentPosition =>
        this.updateLocation.apply(this, arguments)


  updateLocation: (position) ->
    this.lat ?= position.coords.latitude
    this.lng ?= position.coords.longitude

    listingLoc = new LatLon this.model.latitude, this.model.longitude
    userLoc = new LatLon this.lat, this.lng

    dist = parseFloat userLoc.distanceTo listingLoc
    brng = userLoc.bearingTo listingLoc

    direction = _.degreesToDirection brng

    if dist < 1
      distStr = Math.round(dist*1000)+' metres'
    else
      distStr = Math.round(dist*100)/100+' km'

    this.$('#listing-loc-diff').text "Roughly #{distStr} #{direction} of you."



hs.t.Listing.getModel = (options, clbk) ->
  zz.data.listing options.parsedUrl[0], clbk
