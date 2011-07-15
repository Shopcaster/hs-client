
dep.require 'hs.Template'
dep.require 'hs.t.mods.form'
dep.require 'hs.settingsNav'

dep.provide 'hs.t.PasswordSetting'

class hs.t.PasswordSetting extends hs.Template

  appendTo: '#main'

  template: hs.settingsNav '''
    <h1>Change Password</h1>
    <p>To change your password, enter your current password first, and
    then the new password you'd like to set.</p>

    <form id="password-form">
      <span class="formFields"></span>
      <input type="submit" />
    </form>
    '''

  fields: [{
    'name': 'oldPassword',
    'type': 'password',
    'placeholder': 'Old Password'
  }, {
    'name': 'newPassword',
    'type': 'password',
    'placeholder': 'New Password'
  }, {
    'name': 'newPassword2',
    'type': 'password',
    'placeholder': 'New Password (again)'
  }]


hs.t.mods.form hs.t.PasswordSetting
