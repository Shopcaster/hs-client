
dep.require 'hs.Template'
dep.require 'hs.settingsNav'

dep.provide 'hs.t.AvatarSetting'

class hs.t.AvatarSetting extends hs.Template

  authRequired: true
  appendTo: '#main'

  template: hs.settingsNav '''
    <span class="avatar">
      <h1>Change Avatar</h1>
      <img class="current">

      <form id="password-form" method="POST" enctype="multipart/form-data">
        <input type="submit" value="Submit" />
        <input type="file" name="avatar" />
        <input type="hidden" name="email" />
        <input type="hidden" name="password" />
        <span class="confirm">saved</span>
      </form>
    </span>
    '''

  fields: [{
    'name': 'avatar',
    'type': 'file'
  }]

  postRender:->
    this.$('form').attr 'action', "#{conf.serverUri}/iapi/avatar?return=#{encodeURIComponent(document.location.href)}"

    user = zz.auth.curUser()
    this.$('[name=email]').val user.email
    this.$('[name=password]').val user.password

    avatar = zz.models.User.prototype.getAvatarUrl.call zz.auth.curUser(), 75
    this.$('.current').attr 'src', avatar

