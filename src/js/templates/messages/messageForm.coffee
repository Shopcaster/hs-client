
dep.require 'hs.FormTemplate'
dep.require 'hs.authFormFields'

dep.provide 'hs.t.MessageForm'

class hs.t.MessageForm extends hs.FormTemplate

  template: ->
    form ->
      fields()
      input type: 'submit', class: 'submit'


  fields: [{
    'name': 'question'
    'type': 'text'
    'placeholder': 'Question'
    'hide': true
  },{
    'name': 'message'
    'type': 'text'
    'placeholder': 'Message'
  }].concat hs.authFormFields
