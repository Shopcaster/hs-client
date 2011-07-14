
dep.require 'hs.Template'
dep.require 'hs.mods.t.form'
dep.require 'hs.mods.t.authForm'

dep.provide 'hs.t.OfferForm'


class hs.t.OfferForm extends hs.Template

  template: ->
    form class: 'offer-form', ->
      span class: 'formFields'
      input type: 'submit', class: 'submit'


  fields: [{
    'name': 'amount'
    'type': 'text'
    'placeholder': 'Make an Offer'
  }]


hs.mods.t.form hs.t.OfferForm
hs.mods.t.authForm hs.t.OfferForm
