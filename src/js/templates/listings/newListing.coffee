
dep.require 'hs.Template'
dep.require 'hs.t.mods.form'
dep.require 'hs.t.mods.authForm'

dep.provide 'hs.t.NewListing'
dep.provide 'hs.t.NewListingDone'


class hs.t.NewListingDone extends hs.Template
  appendTo: '#main'
  template:->''


class hs.t.NewListing extends hs.Template

  appendTo: '#header > .width'
  id: 'new-listing'


  fields: [{
    'name': 'description',
    'type': 'textarea',
    'placeholder': 'Description',
  },{
    'name': 'price',
    'type': 'text',
    'placeholder': 'Price',
    'maxlength': 6,
  },{
    'name': 'photo',
    'type': 'file',
    'placeholder': 'Photo:',
  },{
    'name': 'latitude',
    'type': 'hidden',
  },{
    'name': 'longitude',
    'type': 'hidden',
  },]


  template: ->
    redirect = encodeURIComponent "#{conf.clientUri}/new-listing"
    """
    <form action="#{conf.serverUri}/iapi/listing?return=#{redirect}"
          method="POST"
          enctype="multipart/form-data"
          class="dialog">
      <span class="formFields"></span>
      <input type="submit" class="submit" value="Submit" />
      <div class="loading">Uploading...</div>
      <div style="clear:both;"></div>
    </form>
    """



hs.t.mods.form hs.t.NewListing
hs.t.mods.authForm hs.t.NewListing
