
dep.require 'hs'

dep.provide 'hs.v.mods.authForm'

hs.v.mods.authForm = (View) ->


  oldInit = View.prototype.modInit
  View.prototype.modInit = ->
    oldInit.call(this)


  View.prototype.validateEmail = (clbk) ->
    return clbk true if zz.auth.curUser()?
    clbk this.get('email')?


  View.prototype.validatePassword = (clbk) ->
    return clbk true if zz.auth.curUser()?
    clbk this.template.$('[name=password]:visible').length == 0 or this.get('password')?


  old_submit = View.prototype._submit
  View.prototype._submit = (e) ->
    e?.preventDefault()

    this._validate (valid) =>
      if valid
        if not zz.auth.curUser()?
          this.cache()
          zz.auth this.get('email'), this.get('password'), =>
            this._authHandler.apply(this, arguments)

        else
          this.submit?()


  View.prototype._authHandler = ->
    if zz.auth.curUser()?
      return this.submit? => this.unCache()

    if this.template.$('[name=password]:visible').length
      this.showInvalid 'password'

    else
      this.template.$('[name=password]').show()

