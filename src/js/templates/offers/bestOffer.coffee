
dep.require 'hs.Template'

dep.provide 'hs.t.BestOffer'

class hs.t.BestOffer extends hs.Template

  offers: []


  template: -> span()


  _update: ->
    offers = _.toArray this.offers
    offers.sort (o1, o2) -> o2.amount - o1.amount

    animate = this.el.text() != ''

    this.el.text "$#{offers[0].amount}"

    if animate
      oldColor = this.el.css 'color'
      this.el.animate {color: '#828200'}, 250, () =>
        this.el.animate {color: oldColor}, 250


  addModel: (id, index) ->
    zz.data.offer id, (offer) =>
      offer.heat()

      if index?
        this.offers.splice index, 0, offer

      else
        this.offers.push offer

      this._update()


  removeModel: (id, index) ->
    offer = this.offers.splice index, 1
    offer.freeze()

    this._update()


  preRemove: -> offer.freeze() for offer in this.offers
