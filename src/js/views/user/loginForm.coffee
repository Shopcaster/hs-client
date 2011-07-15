
dep.require 'hs.Template'
dep.require 'hs.v.mods.form'
dep.require 'hs.v.mods.dialog'

dep.provide 'hs.v.LoginForm'


class hs.v.LoginForm extends hs.View

  focusSelector: '.login'

  submit: ->
    zz.auth this.get('email'), this.get('password'), =>
      if not zz.auth.curUser()?
        this.showInvalid 'password'
      else
        this.blur()
        this.clear()


hs.v.mods.form hs.v.LoginForm
hs.v.mods.dialog hs.v.LoginForm

