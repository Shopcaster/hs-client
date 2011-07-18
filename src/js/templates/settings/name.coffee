
dep.require 'hs.Template'
dep.require 'hs.t.mods.form'
dep.require 'hs.settingsNav'

dep.provide 'hs.t.NameSetting'

class hs.t.NameSetting extends hs.Template

  appendTo: '#main'

  template: hs.settingsNav '''
    <h1>Change Public Name</h1>
    <p>Your public name will be displayed to other users on the site.</p>
    <form id="name-form">
      <span class="formFields"></span>
      <input type="submit" />
    </form>
    '''

  fields: [{
    'name': 'name'
    'type': 'text'
    'placeholder': 'Public Name'
  }]


  postRender: ->
    this.$('.name').val zz.auth.curUser().name


hs.t.mods.form hs.t.NameSetting