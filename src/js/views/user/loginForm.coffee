
dep.require 'hs.Template'
dep.require 'hs.v.mods.form'
dep.require 'hs.v.mods.dialog'

dep.provide 'hs.v.LoginForm'


class hs.v.LoginForm extends hs.View

  focusSelector: '.login'

  events:
    'click .forgot': 'forgot'
    'click .remember': 'remember'


  forgot: (e)->
    e?.preventDefault()
    this.forgot = true
    this.template.$('[name=password]').hide()
    this.template.$('.forgot').hide()
    this.template.$('.remember').show()
    this.template.$('.submit').val 'Reset'

    this.template.$('.formError').removeClass('formError')
    this.template.$(".bubble").remove()


  remember: (e)->
    e?.preventDefault()
    this.forgot = false
    this.template.$('[name=password]').show()
    this.template.$('.forgot').show()
    this.template.$('.remember').hide()
    this.template.$('.submit').val 'Login'


  submit: ->
    if this.forgot == true
      email = this.get('email')
      if email == ''
        this.showInvalid 'email', 'Please enter your email'

      else
        zz.auth.resetPassword email
        this.blur()
        this.clear()
        this.remember()
        zz.emit 'notification', 'Check your email to get your new password'

    else
      zz.auth this.get('email'), this.get('password'), =>
        if not zz.auth.curUser()?
          this.showInvalid 'password', 'Incorrect password'
        else
          this.blur()
          this.clear()


hs.v.mods.form hs.v.LoginForm
hs.v.mods.dialog hs.v.LoginForm
