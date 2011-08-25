
dep.require 'hs'

dep.provide 'hs.v.mods.authForm'

hs.v.mods.authForm = (View) ->


  oldInit = View.prototype.modInit
  View.prototype.modInit = ->
    oldInit.call(this)


  View.prototype.validateEmail = (clbk) ->
    return clbk true if zz.auth.curUser()?
    clbk this.get('email')?, 'Email is required'


  View.prototype.validatePassword = (clbk) ->
    return clbk true if zz.auth.curUser()?
    clbk this.template.$('.password-wrap:visible').length == 0 or this.get('password')?, 'Password is required'


  old_submit = View.prototype._submit
  View.prototype._submit = (e) ->
    e?.preventDefault()

    this._validate (valid) =>
      if valid
        if not zz.auth.curUser()?
          this.cache()
          zz.auth this.get('email'), this.get('password'), _.bind this._authHandler, this

        else
          this.submit?()


  View.prototype._authHandler = ->
    if zz.auth.curUser()?
      return this.submit? => this.unCache()

    this.unCache()

    if this.template.$('.password-wrap:visible').length
      this.showInvalid 'password', 'Invalid password'

    else
      this.template.$('.password-wrap').show()
