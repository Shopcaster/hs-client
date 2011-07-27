
dep.require 'hs.Template'
dep.require 'hs.t.User'
dep.require 'hs.t.UserListings'

dep.provide 'hs.t.Profile'


class hs.t.Profile extends hs.Template

  appendTo: '#main'


  template: ->
    div class: 'profile', ->

      div class: 'user-info'


  subTemplates:
    user:
      class: hs.t.User
      appendTo: '.user-info'

    userListings:
      class: hs.t.UserListings


  postRender: ->
    this.userTmpl this.model, heat:false

    this.model.relatedListings 'creator', (listings) =>
      this.userListingsTmpl listings, appendTo: '#'+this.id


hs.t.Profile.getModel = (options, clbk) ->
  zz.data.user options.parsedUrl[0], clbk

