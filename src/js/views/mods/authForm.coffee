
dep.require 'hs'

dep.provide 'hs.v.mods.authForm'

hs.v.mods.authForm = (View) ->


  oldInit = View.prototype.modInit
  View.prototype.modInit = ->
    oldInit.call(this)


  View.prototype.validateEmail = (clbk) ->
    return clbk true if zz.auth.curUser()?
    clbk this.template.get('email')?


  View.prototype.validatePassword = (clbk) ->
    return clbk true if zz.auth.curUser()?
    clbk this.template.$('[name=password]:visible').length == 0 or this.template.get('password')?


  old_submit = View.prototype._submit
  View.prototype._submit = (e) ->
    e?.preventDefault()

    if not zz.auth.curUser()?
      zz.auth this.get('email'), this.get('password'), =>
        this._authHandler.apply(this, arguments)

    else
      old_submit.apply(this, arguments)


  View.prototype._authHandler = ->
    return old_submit.apply this, arguments if zz.auth.curUser()?

    if this.template.$('[name=password]:visible').length
      this.showInvalid 'password'

    else
      this.template.$('[name=password]').show()

