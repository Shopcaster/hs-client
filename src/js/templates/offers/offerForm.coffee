
dep.require 'hs.FormTemplate'
dep.require 'hs.authFormFields'

dep.provide 'hs.t.OfferForm'

class hs.t.OfferForm extends hs.FormTemplate

  template: ->
    form ->
      fields()
      input type: 'submit', class: 'submit'


  fields: [{
    'name': 'amount'
    'type': 'text'
    'placeholder': 'Make an Offer'
  }].concat hs.authFormFields
