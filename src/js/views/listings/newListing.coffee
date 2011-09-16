
dep.require 'hs.View'
dep.require 'hs.v.mods.dialog'
dep.require 'hs.v.mods.form'
dep.require 'hs.v.mods.authForm'

dep.provide 'hs.v.NewListing'
dep.provide 'hs.v.NewListingDone'


class hs.v.NewListingDone extends hs.View
  init:->
    q = document.location.href.split '?'
    return console.error('GET args required') if not q.length > 1

    q = q[1].split '&'

    args = {}
    for item in q
      item = item.split '='
      args[item[0]] = decodeURIComponent item[1]

    console.log 'goTo', args.success
    hs.goTo '/'+args.success


class hs.v.NewListing extends hs.View

  focusSelector: '.new-listing'


  validateDescription:(clbk)->
    desc = this.get 'description'
    if not desc? or desc.length <= 0
      clbk false, 'Gotta have a description'

    else if desc.length > 200
      clbk false, 'There is a 200 char cap'

    else
      clbk true


  validatePrice:(clbk)->
    price = this.get 'price'
    if not price? or price.length <= 0
      clbk false, 'How much?'

    else if price.length > 6
      clbk false, 'Really? Over 6 figures?'

    else
      clbk true


  validatePhoto:(clbk)->
    photo = this.get 'photo'
    if not photo? or photo.length <= 0
      clbk false, 'Show me the money'

    else
      clbk true



  submit:->
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
