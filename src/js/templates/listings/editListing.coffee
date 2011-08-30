
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
    <span class="edit-listing">
      <span class="edit-wrap">- <a href="javascript:;" class="edit">edit</a></span>
      <form>
        <div style="clear:both;"></div>
        <span class="formFields"></span>
        <input type="submit" class="submit" value="Save" />
        <a href="javascript:;" class="cancel">cancel</a>
        <div style="clear:both;"></div>
      </form>
    </span>
    """


hs.t.mods.form hs.t.EditListing
