
dep.require 'hs.Template'
dep.require 'hs.t.mods.form'

dep.provide 'hs.t.NewListing'


class hs.t.NewListing extends hs.Template

  appendTo: 'header > .width'
  id: 'new-listing'

  fields: [{
    'name': 'image',
    'type': 'image',
    'placeholder': 'Image'
  },{
    'name': 'description',
    'type': 'textarea',
    'placeholder': 'Description'
  },{
    'name': 'price',
    'type': 'number',
    'placeholder': 'Price'
  }]


  template: ->
    form ->
      fields()
      input type: 'submit', value: 'Submit', class: 'submit'


hs.t.mods.form hs.t.NewListing

