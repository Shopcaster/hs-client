
dep.require 'hs.View'

class hs.v.ConvoLI extends hs.View

  events:
    'click .accept-offer': 'acceptOffer'
    'click .cancel-offer': 'cancel'
    'click .sold-offer': 'sold'
    'mousedown .accept-offer': 'stop'
    'mousedown .cancel-offer': 'stop'
    'mousedown .sold-offer': 'stop'

  acceptOffer: (e) ->
    e.preventDefault()
    zz.update.listing this.template.listing, accepted: this.template.offer._id


  cancel: (e) ->
    e.preventDefault()
    zz.update.listing this.template.listing, accepted: null


  sold: (e) ->
    e.preventDefault()
    zz.update.listing this.template.listing, sold: true


  stop: (e) -> e.stopPropagation()

