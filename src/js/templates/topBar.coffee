
dep.require 'hs.Template'
dep.require 'hs.t.LoginForm'

dep.provide 'hs.t.TopBar'



class hs.t.TopBar extends hs.Template

  appendTo: '#top-bar > .width'

  template: -> """
    <div class="inner-top-bar">
      <a href="/about">About</a>
      <a href="https://getsatisfaction.com/hipsell" target="_blank">Feedback</a>
      <a class="name"></a>
      <a href="/settings/name" class="settings">Settings</a>
      <a href="javascript:;" class="logout">Logout</a>
      <a href="javascript:;" class="login">Login</a>
    </div>
    """


  subTemplates:
    loginForm:
      class: hs.t.LoginForm


  postRender: ->
    this.loginFormTmpl()
    this.setName = _.bind this.setName, this


  setAuth: (prev, cur) ->
    this.$('.set-name').remove()

    if cur?
      cur.on 'name', this.setName

      this.$('.login').hide();
      this.$('.logout').show();
      this.$('.settings').show();

      this.$('.name')
        .html(cur.name || cur.email)
        .attr('href', '/'+cur._id)
        .show()

      if not cur.name?
        this.$('.name').after '<a class="set-name" href="/settings/name">(set public name!)</a>'

    else
      prev.removeListener 'name', this.setName if prev?

      this.$('.login').show()
      this.$('.logout').hide()
      this.$('.settings').hide()
      this.$('.name').hide().text('')


  setName: ->
    user = zz.auth.curUser()
    this.$('.name').text user.name if user?

