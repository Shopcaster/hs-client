
dep.require 'hs.Template'
dep.require 'hs.t.mods.form'
dep.require 'hs.t.mods.authForm'

dep.provide 'hs.t.NewListing'


class hs.t.NewListing extends hs.Template

  appendTo: '#header > .width'
  id: 'new-listing'


  fields: [{
    'name': 'description',
    'type': 'textarea',
    'placeholder': 'Description'
  },{
    'name': 'price',
    'type': 'text',
    'placeholder': 'Price'
  },{
    'name': 'photo',
    'type': 'file',
    'placeholder': 'Image'
  },{
    'name': 'latitude',
    'type': 'hidden',
  },{
    'name': 'longitude',
    'type': 'hidden',
  },]


  template: -> """
    <form action="#{conf.serverUri}/iapi/listing" method="POST" enctype="multipart/form-data">
      <span class="formFields"></span>
      <input type="submit" class="submit" value="Submit" />
      <div style="clear:both;"></div>
    </form>
    """


hs.t.mods.form hs.t.NewListing
hs.t.mods.authForm hs.t.NewListing
