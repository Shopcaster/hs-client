
dep.require 'hs.View'
dep.require 'hs.v.mods.dialog'
dep.require 'hs.v.mods.form'
dep.require 'hs.v.mods.authForm'

dep.provide 'hs.v.NewListing'

class hs.v.NewListing extends hs.View

  focusSelector: '.new-listing'


  submit:->
    console.log 'submitting'

    user = zz.auth.curUser()

    this.template.$('input[name=email]').val user.email
    this.template.$('input[name=password]').val user.password

    hs.geo.get (position)=>

      this.template.$('input[name=latitude]').val position.coords.latitude
      this.template.$('input[name=longitude]').val position.coords.longitude

      this.browserSubmit()


hs.v.mods.form hs.v.NewListing
hs.v.mods.dialog hs.v.NewListing
hs.v.mods.authForm hs.v.NewListing
