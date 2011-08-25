
dep.require 'hs.Template'
dep.require 'hs.t.mods.form'

dep.provide 'hs.t.EditListing'


class hs.t.EditListing extends hs.Template

  heat: false

  fields: [{
    'name': 'description'
    'type': 'textarea'
    'placeholder': 'Description'
    'maxlength': 200
  }]

  template: -> """
    <form class="edit-listing">
      <span class="formFields"></span>
      <input type="submit" class="submit" value="Submit" />
    </form>
    """


hs.t.mods.form hs.t.EditListing
