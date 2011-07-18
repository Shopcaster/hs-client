
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


  _update: (node, amount) ->
    animate = node.text() != ''

    node.text "$#{amount}"

    if animate
      oldColor = node.css 'color'
      node.animate {color: '#828200'}, 250, () =>
        node.animate {color: oldColor}, 250


  setBestOffer: ->
    offers = _.values this.offers
    offers.sort (o1, o2) -> o2.amount - o1.amount

    this._update this.$('.value.best-offer'), offers[0].amount


  setMyOffer: (offer) ->
    this._update this.$('.value.my-offer'), offer.amount
    this.setBestOffer()


  addModel: (offer, index) ->
    offer.heat()
    this.offers[offer._id] = offer

    if offer.creator == zz.auth.curUser()?._id
      offer.on 'amount', => this.setMyOffer offer
      this.setMyOffer offer
    else
      this.setBestOffer()


  removeModel: (offer, index) ->
    offer.freeze()
    delete this.offers[offer._id]

    this.setBestOffer()


  preRemove: ->
    for id, offer of this.offers
      offer.freeze() if offer.hot
