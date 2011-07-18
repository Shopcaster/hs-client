
dep.require 'zz'
dep.provide 'zz.models.Listing'


zz.models.Listing.prototype.bestOffer = (clbk) ->
  this.model.relatedOffers (offers) =>
    offers.sort (o1, o2) -> o2.amount - o1.amount
    clbk offers[0]


zz.models.Listing.prototype.offerForUser = (user, clbk) ->
  return clbk null if not user?

  this.relatedOffers (offers) =>
    console.log 'offerForUser', this.hot, this._id, 'relatedOffers',  offers
    for offer in offers
      if offer.creator == user._id
        return clbk offer
    clbk null

zz.models.Listing.prototype.myOffer = (clbk) ->
  this.offerForUser zz.auth.curUser(), clbk


zz.models.Listing.prototype.convoForUser = (user, clbk) ->
  return clbk null if not user?

  this.relatedConvos (convos) =>
    for convo in convos
      if convo.creator == user._id
        return clbk convo
    clbk null

zz.models.Listing.prototype.myConvo = (clbk) ->
  this.convoForUser zz.auth.curUser(), clbk
