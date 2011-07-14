
dep.require 'hs.Template'
dep.require 'hs.mods.t.form'
dep.require 'hs.mods.t.authForm'

dep.provide 'hs.t.MessageForm'

class hs.t.MessageForm extends hs.Template

  template: ->
    form ->
      span class: 'formFields'
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
  }]


hs.mods.t.form hs.t.MessageForm
hs.mods.t.authForm hs.t.MessageForm
