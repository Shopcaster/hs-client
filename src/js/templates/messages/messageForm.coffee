
dep.require 'hs.Template'
dep.require 'hs.t.mods.form'
dep.require 'hs.t.mods.authForm'

dep.provide 'hs.t.MessageForm'

class hs.t.MessageForm extends hs.Template

  template: -> """
    <form>
      <span class="formFields"></span>
      <input type="submit" class="submit" value="Submit" />
    </form>
    """


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



hs.t.mods.form hs.t.MessageForm
hs.t.mods.authForm hs.t.MessageForm
