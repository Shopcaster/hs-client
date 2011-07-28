
dep.require 'hs.Template'

dep.provide 'hs.t.Offers'

class hs.t.Offers extends hs.Template

  offers: {}
  id: 'listing-offerbar'


  template: ->
    div class: 'clearfix', ->

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


  postRender: ->
    this.$('.asking.value').text "$#{this.options.listing.price}"


  preRemove: ->
    (offer.freeze() if offer.hot) for id, offer of this.offers


  _update: (node, amount) ->

    node.text "$#{amount/100}"

    if not this.modelInit
      oldColor = node.css 'color'
      node.animate {color: '#828200'}, 250, () =>
        node.animate {color: oldColor}, 250


  setBestOffer: ->
    offers = _.values this.offers
    offers.sort (o1, o2) -> o2.amount - o1.amount

    this._update this.$('.value.best-offer'), offers[0].amount


  setMyOffer: ->
    this._update this.$('.value.my-offer'), this.myOffer.amount


  setAuth: (prev, cur) ->
    if this.myOffer?
      this.myOffer.removeAllListeners 'amount'
      this.myOffer = null

    this.$('.right .title').text 'My Offer'
    this.$('.right .value').text '$0'

    if cur? and cur._id == this.options.listing.creator
      this.$('.right .title').text ''
      this.$('.right .value').text ''

    else if cur?
      for id, offer of this.offers
        if offer.creator == cur._id
          this.myOffer = offer
          this.myOffer.on 'amount', => this.setMyOffer
          this.setMyOffer
          break



  addModel: (offer, index) ->
    offer.heat()
    this.offers[offer._id] = offer

    if offer.creator == zz.auth.curUser()?._id
      this.myOffer = offer
      this.myOffer.on 'amount', => this.setMyOffer()
      this.setMyOffer()

    offer.on 'amount', => this.setBestOffer()
    this.setBestOffer()


  removeModel: (offer, index) ->
    offer.freeze()
    delete this.offers[offer._id]

    this.setBestOffer()
