
dep.require 'hs.View'

class hs.v.OfferForm extends hs.View

  submit: ->
    if this.template.model?
      zz.update.offer this.template.model, amount: this.get('amount'), ->
        this.clear()

    else
      zz.create.offer
        amount: this.get 'amount'
        listing: this.options.listing
