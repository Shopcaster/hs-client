
dep.require 'hs'

dep.provide 'hs.mods.t.authForm'

hs.mods.t.authForm = (Template) ->

  Template.prototype.fields ||= []
  Template.prototype.fields = Template.prototype.fields.concat [{
      name: 'email'
      type: 'email'
      placeholder: 'Email'
      hide: true
    },{
      name: 'password'
      type: 'password'
      placeholder: 'Password'
      hide: true
  }]
  console.log 'authForm fields added', Template.name, Template.prototype.fields


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


