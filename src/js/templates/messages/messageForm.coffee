
dep.require 'hs.FormTemplate'

dep.provide 'hs.t.MessageForm'

class hs.t.MessageForm extends hs.FormTemplate

  template: ->
    form ->
      this.inputs()
      input type: 'submit', class: 'submit'


  fields: [{
    'name': 'question',
    'type': 'text',
    'placeholder': 'Question',
    'hide': true
  },{
    'name': 'message',
    'type': 'text',
    'placeholder': 'Message'
  }]
