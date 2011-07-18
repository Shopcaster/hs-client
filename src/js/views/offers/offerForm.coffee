
dep.require 'hs.View'
dep.require 'hs.v.mods.form'
dep.require 'hs.v.mods.authForm'
dep.require 'hs.v.mods.dialog'

dep.provide 'hs.v.OfferForm'


class hs.v.OfferForm extends hs.View

  focusSelector: '.offer-button'

  amount: ->
    parseFloat this.get('amount')


  submit: ->
    this.options.listing.myOffer (offer) =>

      if offer?
        console.log 'updating offer'
        zz.update.offer offer, amount: this.amount(), =>
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
