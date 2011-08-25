
dep.require 'hs.View'
dep.require 'hs.v.mods.form'

dep.provide 'hs.v.EditListing'

class hs.v.EditListing extends hs.View

  validateDescription: (clbk)->
    if not this.get('description').length <= 200
      clbk false, 'The description must be less then 200 characters.'

    else if this.get('description').length == 0
      clbk false, 'Empty description are no good.'

    else
      clbk true


  submit: (clbk)->
    zz.data.listing.update this.template.model, description: this.get('description'), =>



hs.v.mods.form hs.v.EditListing
