
dep.require 'hs.Template'
dep.require 'zz'
dep.require 'hs.t.User'
dep.require 'hs.t.Inquiries'
dep.require 'hs.t.Convo'
dep.require 'hs.t.ConvoList'
dep.require 'hs.t.OfferForm'
dep.require 'hs.t.Offers'
dep.require 'hs.t.EditListing'
dep.require 'hs.geo'

dep.provide 'hs.t.Listing'


class hs.t.Listing extends hs.Template

  appendTo: '#main'

  template: -> """
    <div itemscope class="listing clearfix">

      <div class="section-left">
        <div id="listing-image"><img itemprop="image"></div>
      </div>

      <div class="section-right">
        <div id="listing-details">
          <div id="listing-creator"></div>
          <span class="status">Available</span>
          <div id="listing-description" itemprop="description"></div>
          <div class="listing-edit-description"></div>

          <div class="bottom">
            <div id="listing-social">
              <a href="javascript:;" class="twitter"><img src="/img/tweet.png"/></a>
              <a href="javascript:;" class="fb"><img src="/img/like.png"/></a>
              <div class="goog"></div>
            </div>

            <span id="listing-loc-diff"></span>
            <span class="created"></span>

            <a href="javascript:;" class="map-link" target="_blank">
              <img class="map">
            </a>

            <div class="offer-form-wrapper">
              <div class="button offer-button">Make an Offer</div>
            </div>
          </div>
        </div>
      </div>

      <div id="listing-messages" class="section-right list-box">
        <h2>Message the Seller</h2>
      </div>

      <div id="listing-inquiries" class="section-left list-box">
        <h2>Frequently Asked Questions</h2>
      </div>
    """


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

    offers:
      class: hs.t.Offers
      appendTo: '.listing .bottom'

    edit:
      class: hs.t.EditListing
      appendTo: '.listing-edit-description'


  postRender: ->
    this.model.relatedInquiries this.inquiriesTmpl
    this.model.relatedOffers (offers) =>
      this.offersTmpl offers, listing: this.model

    this.meta property: 'og:title', content: 'Listing on Hipsell'
    this.meta property: 'og:type', content: 'product'
    this.meta property: 'og:url', content: window.location.toString()
    this.meta property: 'og:site_name', content: 'Hipsell'
    this.meta property: 'og:image', content: "#{conf.serverUri}/#{this.model.photo}"
    this.meta property: 'og:description', content: this.model.description
    this.meta property: 'fb:app_id', content: '110693249023137'


  showOfferButton: ->
    this.$('.offer-button').show()
    this.$('.bottom').css 'height': 255


  hideOfferButton: ->
    this.$('.offer-button').hide()
    this.$('.bottom').css 'height': 210


  setAuth: (prev, cur) ->
    this.offerFormTmpl.remove()
    this.newConvo()

    this.$('#listing-creator .profile').remove()

    if not cur? or this.model.creator != cur._id
      this.showOfferButton() if not this.model.sold

      this.offerFormTmpl null, listing: this.model

      this.$('.edit-wrap').remove()

    else
      this.hideOfferButton()
      this.editTmpl this.model

      this.$('#listing-description').append ''


  newConvo: ->
    this.convoTmpl.remove()
    this.convoListTmpl.remove()

    user = zz.auth.curUser()

    if user? and this.model.creator == user._id
      this.$('#listing-messages h2').text 'Buyer Messages'

      this.model.relatedConvos =>
        this.convoListTmpl.apply(this, arguments)

    else
      this.$('#listing-messages h2').text 'Message the Seller'
      this.model.myConvo (convo) =>
        if convo?
          convo.relatedMessages (messages) =>
            this.convoTmpl messages, convo: convo, listing: this.model
        else
          this.convoTmpl null, listing: this.model


  setCreator: () ->
    zz.data.user this.model, 'creator', (creator) =>
      this.userTmpl creator

      cur = zz.auth.curUser()
      if not cur? or this.model.creator != cur._id
        this.$('#listing-creator .name').after("
        <a href='/#{this.model.creator}' class='profile'>
            More items by this seller</a>");


  setPhoto: () ->
    url = "#{conf.serverUri}/#{this.model.photo}"
    this.$('#listing-image > img').attr 'src', url


  setDescription: () ->
    this.$('#listing-description').text this.model.description
    $('document.title').text "Hipsell - #{this.model.description}"
    this.meta property: 'og:description', content: this.model.description


  setCreated: () ->
    this.$('#listing-details .created').liveSince this.model.created

  setPrice: () ->
    this.$('.asking.value').text "$#{this.model.price}"


  setLongitude: -> this.setLocation.apply this, arguments
  setLatitude: -> this.setLocation.apply this, arguments
  setLocation: () ->
    if this.model.location?
      lat = this.model.location[0]
      lng = this.model.location[1]
    else
      lat = this.model.latitude
      lng = this.model.longitude

    if document.documentElement && document.documentElement.clientWidth <= 480
      width = 210
    else
      width = 380

    this.$('img.map').attr 'src',
      "http://maps.google.com/maps/api/staticmap?center=#{lat},#{lng}&zoom=14&size=#{width}x100&sensor=false"

    this.$('.map-link').attr 'href',
      "http://maps.google.com/?ll=#{lat},#{lng}&z=16"

    this.meta property: 'og:latitude', content: lat
    this.meta property: 'og:longitude', content: lng


  setAccepted: -> this.setStatus()
  setSold: -> this.setStatus()
  setStatus: ->
    if this.model.accepted? and not this.model.sold
      this.$('.status').text('Offer Accepted').addClass('accepted').removeClass('sold')
    else if this.model.sold
      this.$('.status').text('Sold').addClass('sold').removeClass('accepted')
      this.hideOfferButton()
    else
      this.$('.status').text('Available').removeClass('sold').removeClass('accepted')



hs.t.Listing.getModel = (options, clbk) ->
  id = options.parsedUrl[0]#.replace('item', 'listing')
  zz.data.listing id, clbk
