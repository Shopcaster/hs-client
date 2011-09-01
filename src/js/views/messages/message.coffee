
dep.require 'hs.View'

dep.provide 'hs.v.Message'


class hs.v.Message extends hs.View

  events:
    'click .pub': 'answerPublicly'
    'click .accept-offer-inline': 'acceptOffer'
    'click .cancel-offer-inline': 'cancelOffer'


  init:->
    if this.template.listing?
      this.template.listing.on 'sold', _.bind this.registerDomEvents, this


  answerPublicly: ->
    this.parent.answerPublicly this.template.model.message


  acceptOffer:->
    zz.update.listing this.template.listing, accepted: this.template.model.offer, sold: true


  cancelOffer:->
    zz.update.listing this.template.listing, accepted: null, sold: false

