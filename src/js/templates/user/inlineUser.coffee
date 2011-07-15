
dep.require 'hs.t.User'

dep.provide 'hs.t.InlineUser'


class hs.t.InlineUser extends hs.t.User

  template: ->
    div class: 'user inline', ->
      div class: 'presence offline'
      img class: 'avatar'
      span class: 'name', -> 'Anonymous'

  setAvatar: ->
    this.$('.avatar').attr 'src', this.model.getAvatarUrl(30)
