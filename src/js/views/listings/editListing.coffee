
dep.require 'hs.View'
dep.require 'hs.v.mods.form'

dep.provide 'hs.v.EditListing'

class hs.v.EditListing extends hs.View

  events:
    'click .edit': 'edit'
    'click .cancel': 'cancel'


  edit: (e)->
    e.preventDefault()
    this.template.$('form').show()
    this.template.$('.edit-wrap').hide()
    $('#listing-description').hide()
    this.template.$('textarea').val $('#listing-description').text()


  cancel: (e)->
    e?.preventDefault()
    this.template.$('form').hide()
    this.template.$('.edit-wrap').show()
    $('#listing-description').show()
    this.clear()


  validateDescription: (clbk)->
    if not this.get('description').length > 200
      clbk false, 'The description must be less then 200 characters.'

    else if this.get('description').length == 0
      clbk false, 'Empty description are no good.'

    else
      clbk true


  submit: (clbk)->
    zz.update.listing this.template.model,
      description: this.get('description'),
      => this.cancel()


hs.v.mods.form hs.v.EditListing
