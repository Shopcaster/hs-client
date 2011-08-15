
dep.require 'hs.Template'
dep.require 'hs.t.mods.form'
dep.require 'hs.t.mods.authForm'

dep.provide 'hs.t.OfferForm'


class hs.t.OfferForm extends hs.Template

  template: -> """
    <form class="offer-form">
      <span class="formFields"></span>
      <input type="submit" class="submit" />
    </form>
    """


  fields: [{
    'name': 'amount'
    'type': 'text'
    'value': '$'
    'placeholder': 'Make an Offer'
    'maxlength': 6
  }]


hs.t.mods.form hs.t.OfferForm
hs.t.mods.authForm hs.t.OfferForm
