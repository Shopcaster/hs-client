
dep.require 'hs.auth.views.AuthForm'
dep.require 'hs.views.mixins.Dialog'
dep.require 'hs.offers.views'

dep.provide 'hs.offers.views.Form'

hs.offers.views.Form = hs.auth.views.AuthForm.mixin(hs.views.mixins.Dialog).extend
  template: 'offerForm'

  fields: [{
    'name': 'amount',
    'type': 'text',
    'placeholder': 'Make an Offer'
  }].concat hs.auth.views.AuthForm.prototype.fields

  events: _.extend {
    'focus [name=amount]': 'amountFocus',
    'blur [name=amount]': 'amountBlur'
  }, hs.auth.views.AuthForm.prototype.events


  initialize: (opts) ->
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments)
    this.listing = opts.listing


  amountFocus: ->
    if (this.$('[name=amount]').val() == '')
      this.$('[name=amount]').val('$')


  amountBlur: ->
    if (this.$('[name=amount]').val() == '$')
      this.$('[name=amount]').val('')


  focus: ->
    if (this.disabled) then return
    hs.views.mixins.Dialog.focus.apply(this, arguments)
    this.$('[name=amount]').focus()


  validateAmount: (value, clbk) ->
    clbk(/^\d+$/.test(value.replace('$', '')))


  submit: ->
    if (this.disabled) then return

    oldOffer = this.listing.get('offers').find (offer) =>
      offer.get('creator')._id == hs.users.User.get()?._id

    if oldOffer
      oldOffer.destroy 
        success: => this.submit()
      return;

    this.model = new hs.offers.Offer()
    this.model.set
      listing: this.listing
      amount: parseFloat(this.get('amount').replace('$', ''))

    this.model.save()

    this.blur()
    this.clear()


  disable: -> this.disabled = true

  enable: -> this.disabled = false

