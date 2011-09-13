
dep.require 'hs.Template'
dep.require 'hs.t.mods.form'

dep.provide 'hs.t.LoginForm'


class hs.t.LoginForm extends hs.Template

  appendTo: '#top-bar > .width'
  id: 'login-form'

  fields: [{
      'name': 'email',
      'type': 'email',
      'placeholder': 'Email'
    },{
      'name': 'password',
      'type': 'password',
      'placeholder': 'Password'
  }]


  template: -> """
    <form class="formDialog dialog">
      #{this.renderFields()}
      <a href="javascript:;" class="forgot">I forgot my password : /</a>
      <a href="javascript:;" class="remember">Oh, I remember</a>
      <input type="submit" value="Login" class="dark submit" />
    </form>
    """


hs.t.mods.form hs.t.LoginForm

