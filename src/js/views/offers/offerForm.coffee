
dep.require 'hs.View'
dep.require 'hs.v.mods.form'
dep.require 'hs.v.mods.authForm'
dep.require 'hs.v.mods.dialog'

dep.provide 'hs.v.OfferForm'


class hs.v.OfferForm extends hs.View

  focusSelector: '.offer-button'

  amount: ->
    parseInt parseFloat(this.get('amount').replace '$', '')*100


  validateAmount: (clbk) -> clbk !_.isNaN this.amount()


  createMessage: (amount) ->
    this.options.listing.myConvo (convo) =>
      if convo?
        zz.create.message
          message: "I've made an offer for $#{amount/100}!"
          convo: convo._id

      else
        zz.create.convo listing: this.options.listing, (convoId) =>
          zz.data.convo convoId, (convo) =>
            this.createMessage amount


  submit: ->
    this.options.listing.myOffer (offer) =>

      if offer?
        console.log 'updating offer'
        zz.update.offer offer, amount: this.amount(), =>
          this.createMessage(this.amount())
          this.clear()
          this.blur()


      else
        console.log 'creating offer'
        zz.create.offer
          amount: this.amount()
          listing: this.options.listing._id
          =>
            this.clear()
            this.blur()


hs.v.mods.form hs.v.OfferForm
hs.v.mods.authForm hs.v.OfferForm
hs.v.mods.dialog hs.v.OfferForm
