
dep.require 'hs.View'
dep.require 'hs.v.mods.form'

dep.provide 'hs.v.PasswordSetting'


class hs.v.PasswordSetting extends hs.View

  validate: (clbk) ->
    if not this.get('newPassword') == this.get('newPassword2')
      this.showInvalid 'newPassword2'

    else
      clbk()


  submit: ->
    zz.auth.changePassword this.get('oldPassword'), this.get('newPassword'), =>
      this.clear()



hs.v.mods.form hs.v.PasswordSetting
