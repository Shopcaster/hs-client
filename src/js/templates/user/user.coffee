
dep.require 'hs.Template'
dep.require 'zz'

dep.provide 'hs.t.User'

class hs.t.User extends hs.Template

  template: -> """
    <div class="user">
      <div class="presence offline"></div>
      <img class="avatar">
      <a class="name">Anonymous</a>
      <div class="social">
        <a target="_blank" class="fb"><img src="/img/fb.png"></a>
        <a target="_blank" class="twitter"><img src="/img/twitter.png"></a>
        <a target="_blank" class="linkedin"><img src="/img/linkedin.png"></a>
      </div>
    </div>
    """


  postRender: ->
    if this.model?
      this.setPresence = _.bind(this.setPresence, this)
      zz.presence.on this.model._id, this.setPresence

      this.$('.name').attr 'href', '/'+this.model._id

    else
      this.$('.avatar').attr 'src', '/img/default_avatar.png'


  preRemove: ->
    if this.model?
      zz.presence.removeListener this.model._id, this.setPresence


  setName: ->
    this.$('.name').text this.model.name


  setAvatar: ->
    this.$('.avatar').attr 'src', this.model.getAvatarUrl(75)


  setPresence: (status) ->
    if typeof status == 'string'
      node = this.$('.presence')
      node.removeClass 'away online offline'
      node.addClass status
      node.attr 'title', status.toUpperCase()
    else
      console.error 'presence status is not a string ', status


  setFb: ->
    this.$('.fb').attr('href', this.model.fb).show()

  setTwitter: ->
    this.$('.twitter').attr('href', this.model.twitter).show()

  setLinkedin: ->
    this.$('.linkedin').attr('href', this.model.linkedin).show()
