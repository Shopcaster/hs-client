
dep.require 'hs.View'
dep.require 'hs.mods.v.form'
dep.require 'hs.mods.v.authForm'
dep.require 'hs.mods.v.dialog'

dep.provide 'hs.v.OfferForm'


class hs.v.OfferForm extends hs.View

  focusSelector: '.offer-button'

  submit: ->
    if this.template.model?
      zz.update.offer this.template.model, amount: this.get('amount'), ->
        this.clear()

    else
      zz.create.offer
        amount: this.get 'amount'
        listing: this.options.listing._id


hs.mods.v.form hs.v.OfferForm
hs.mods.v.authForm hs.v.OfferForm
hs.mods.v.dialog hs.v.OfferForm
