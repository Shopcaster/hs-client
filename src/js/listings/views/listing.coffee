
dep.require 'hs.views.Page'
dep.require 'hs.listings.views'
dep.require 'hs.listings.Listing'
dep.require 'hs.users.views.User'
dep.require 'hs.inquiries.views.Inquiries'
dep.require 'hs.messages.views.ConvoList'
dep.require 'hs.messages.views.Conversation'

dep.provide 'hs.listings.views.Listing'


hs.listings.views.Listing = hs.views.Page.extend
  template: 'listingPage'

  modelEvents:
    'change:creator': 'updateCreator'
    'change:photo': 'updatePhoto'
    'change:description': 'updateDesc'
    'change:created': 'updateCreated'
    'change:modified': 'updateCreated'
    'change:latitude': 'updateLoc'
    'change:longitude': 'updateLoc'
    'change:price': 'updatePrice'
    'change:offers': 'updateBestOffer'
    'change:accepted': 'updateAccepted'
    'change:sold': 'updateSold'

  render: () ->
    hs.views.Page::render.apply this, arguments

    hs.auth.bind 'change:isAuthenticated', @updateCreator, this

    @inquiries = new hs.inquiries.views.Inquiries
      appendTo: $('#listing-inquiries')
      model: @model
    @inquiries.render()

    @$('.twitter').html '
      <a href="http://twitter.com/share"
         class="twitter-share-button"
         data-count="horizontal"
         data-via="hipsellapp"
         data-text="Check out this awesome item for sale on Hipsell. Snap it up before it\'s too late.">
          Tweet
      </a>
      <script src="http://platform.twitter.com/widgets.js"></script>'

    if Modernizr.geolocation
      navigator.geolocation.getCurrentPosition _.bind(@updateLocation, this)

    hs.setMeta 'og:title', 'Listing at Hipsell'
    hs.setMeta 'og:type', 'product'
    hs.setMeta 'og:url', window.location.toString()
    hs.setMeta 'og:site_name', 'Hipsell'
    hs.setMeta 'fb:app_id', '110693249023137'

  updateCreator: () ->
    @creator = @model.get 'creator'

    if @creator? and not @creatorView?
      @creatorView = new hs.users.views.User
        el: @$('#listing-creator')
        model: @creator

      @creatorView.render()

    if @creator? and hs.auth.isAuthenticated() and @creator._id == hs.users.User.get()._id and not @convoList?

      if @convo?
        @convo.remove()
        @convo = null

      @convoList = new hs.messages.views.ConvoList
        appendTo: $('#listing-messages')
        model: @model

      @convoList.render()

    else if not @convo?

      if @convoList?
        @convoList.remove()
        @convoList = null

      @convo = new hs.messages.views.Conversation
        appendTo: $('#listing-messages')
        listing: @model

      @convo.render()

  updatePhoto: () ->
    if @model.get('photo')?
      url = "http://#{conf.server.host}:#{conf.server.port}/static/#{@model.get('photo')}"

      @$('#listing-image img').attr 'src', url
      hs.setMeta 'og:image', url

  updateDesc: () ->
    if @model.get('description')?
      @$('#listing-description').text(@model.get('description'))
      $('title').text('Hipsell - '+@model.get('description'))

      hs.setMeta 'og:description', this.model.get('description')

  updateCreated: () ->
    if @model.get('created')?
      since = _.since @model.get('created')
      @$('.date .listing-obi-title').text(since.text)
      @$('.date .listing-obi-value').text(since.num)

  updateLoc: () ->
    if @model.get('latitude')? and @model.get('longitude')?

      lat = @model.get('latitude')
      lng = @model.get('longitude')

      @$('img.map').attr 'src',
        "http://maps.google.com/maps/api/staticmap?center=#{lat},#{lng}&zoom=14&size=340x100&sensor=false"

      @$('.mapLink').attr 'href',
        "http://maps.google.com/?ll=#{lat},#{lng}&z=16"

      hs.setMeta 'og:latitude', lat
      hs.setMeta 'og:longitude', lng

  updateLocation: (position) ->
    listingLoc = new LatLon @model.get('latitude'), @model.get('longitude')
    userLoc = new LatLon position.coords.latitude, position.coords.longitude

    dist = parseFloat userLoc.distanceTo listingLoc
    brng = userLoc.bearingTo listingLoc

    direction = _.degreesToDirection brng

    if dist < 1
      distStr = Math.round(dist*1000)+' metres'
    else
      distStr = Math.round(dist*100)/100+' km'

    @$('#listing-locDiff').text "Roughly #{distStr} #{direction} of you."


  updatePrice: () ->
    if @model.get('price')?
      @$('.asking .listing-obi-value').text('$'+@model.get('price'))

  updateBestOffer: () ->
    @model.bestOffer (best) =>
      if best
        node = @$('.best-offer .listing-obi-value')

        node.text('$'+best.get('amount'))

        node.animate {color: '#828200'}, 250, () ->
          node.animate {color: '#5E5E5E'}, 250

  updateSold: () ->
    if @model.get('sold')
      @$('.status').removeClass('accepted').addClass('sold').text('Sold')

  updateAccepted: () ->
    accepted = @model.get('accepted')
    if accepted?
      @$('.status').removeClass('sold').addClass('accepted').text('Offer Accepted')
      @accepted = true
      @offers.disable(accepted)
      @inquiries.disable()
    else if @accepted?
      @$('.status').hide()
      @accepted = false
      @offers.enable()
      @inquiries.enable()
