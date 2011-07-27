
dep.require 'hs.View'
dep.require 'hs.v.mods.dialog'
dep.require 'hs.v.mods.form'

dep.provide 'hs.v.NewListing'

class hs.v.NewListing extends hs.View

  focusSelector: '.new-listing'


  submit: ->
    console.log 'NewListing submit'


hs.v.mods.form hs.v.NewListing
hs.v.mods.dialog hs.v.NewListing
