
dep.require 'hs.Template'

dep.provide 'hs.t.Offers'

class hs.t.Offers extends hs.Template

  offers: []
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
    offers = _.toArray this.offers
    offers.sort (o1, o2) -> o2.amount - o1.amount

    this._update this.$('.value.best-offer'), offers[0].amount


  setMyOffer: (offer) ->
    console.log 'myOffer:', offer
    this._update this.$('.value.my-offer'), offer.amount


  addModel: (offer, index) ->
    offer.heat()

    if offer.creator == zz.auth.curUser()?._id
      offer.on 'amount', => this.setMyOffer offer
      this.setMyOffer offer

    if index?
      this.offers.splice index, 0, offer

    else
      this.offers.push offer

    this.setBestOffer()


  removeModel: (id, index) ->
    offer = this.offers.splice index, 1
    offer.freeze()

    this.setBestOffer()


  preRemove: -> offer.freeze() if offer.hot for offer in this.offers
