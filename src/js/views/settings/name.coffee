
dep.require 'hs.View'
dep.require 'hs.v.mods.form'

dep.provide 'hs.v.NameSetting'


class hs.v.NameSetting extends hs.View

  submit: ->
    zz.update.user zz.auth.curUser(), name: this.get('name'), => this.clear()

hs.v.mods.form hs.v.NameSetting
