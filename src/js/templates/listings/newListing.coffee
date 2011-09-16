
dep.require 'hs.Template'
dep.require 'hs.t.mods.form'
dep.require 'hs.t.mods.authForm'

dep.provide 'hs.t.NewListing'
dep.provide 'hs.t.NewListingDone'


class hs.t.NewListingDone extends hs.Template
  preRender:->
    q = document.location.href.split '?'
    return console.error('GET args required') if not q.length > 1

    q = q[1].split '&'

    args = {}
    for item in q
      item = item.split '='
      args[item[0]] = item[1]

    hs.goTo args.success


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
    'placeholder': 'Price'
  },{
    'name': 'photo',
    'type': 'file',
    'placeholder': 'Photo:'
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
    <form action="#{conf.serverUri}/iapi/listing?redirect=#{redirect}"
          method="POST"
          enctype="multipart/form-data"
          class="dialog">
      <span class="formFields"></span>
      <input type="submit" class="submit" value="Submit" />
      <div style="clear:both;"></div>
    </form>
    """



hs.t.mods.form hs.t.NewListing
hs.t.mods.authForm hs.t.NewListing
