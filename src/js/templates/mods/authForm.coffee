
dep.require 'hs'

dep.provide 'hs.t.mods.authForm'

hs.t.mods.authForm = (Template) ->

  Template.prototype.fields ||= []
  Template.prototype.fields = Template.prototype.fields.concat [{
      name: 'email'
      type: 'email'
      placeholder: 'Your Email Address'
      hide: true
    },{
      name: 'password'
      type: 'password'
      placeholder: 'Password'
      hide: true
  }]


  oldInit = Template.prototype.modInit
  Template.prototype.modInit = ->
    oldInit.call(this)

    this.on 'postFormRender', =>
      this.on 'setAuth', => this._setAuthForm.call this
      this._setAuthForm()


  Template.prototype._setAuthForm = ->
    user = zz.auth.curUser()

    if not user?
      this.$('input[name=email]').show()

    else
      this.$('input[name=email]').hide()
      this.$('input[name=password]').hide()


