
dep.require 'hs.View'

class hs.v.ConvoLI extends hs.View

  events:
    'click .accept-offer': 'sold'
    'click .cancel-sold': 'cancel'
    'mousedown .accept-offer': 'stop'
    'mousedown .cancel-sold': 'stop'


  init: -> this.template.on 'domEventChanges', => this.registerDomEvents true


  sold: (e) ->
    e.preventDefault()
    zz.update.listing this.template.listing, accepted: this.template.offer._id, sold: true


  cancel: (e) ->
    e.preventDefault()
    zz.update.listing this.template.listing, accepted: null, sold:false


  stop: (e) ->
    e.preventDefault()
    e.stopPropagation()

