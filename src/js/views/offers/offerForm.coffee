
dep.require 'hs.View'
dep.require 'hs.v.mods.form'
dep.require 'hs.v.mods.authForm'
dep.require 'hs.v.mods.dialog'

dep.provide 'hs.v.OfferForm'


class hs.v.OfferForm extends hs.View

  focusSelector: '.offer-button'

  submit: ->
    if this.template.model?
      zz.update.offer this.template.model, amount: this.get('amount'), ->
        this.clear()

    else
      zz.create.offer
        amount: parseInt this.get 'amount'
        listing: this.options.listing._id
        =>
          this.clear()
          this.blur()
          this.template.parent.setMyOffer()


hs.v.mods.form hs.v.OfferForm
hs.v.mods.authForm hs.v.OfferForm
hs.v.mods.dialog hs.v.OfferForm
