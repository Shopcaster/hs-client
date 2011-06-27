
hs.require('hs.views.Form');
hs.require('hs.auth');
hs.provide('hs.users.views.LoginDialog');


hs.users.views.LoginDialog = hs.views.Form.mixin(hs.views.mixins.Dialog).extend({
  appendTo: $('#top-bar .width'),
  template: 'loginForm',
  focusSelector: '#top-bar .login',
  fields: [{
      'name': 'email',
      'type': 'email',
      'placeholder': 'Email'
    },{
      'name': 'password',
      'type': 'password',
      'placeholder': 'Password'
  }],
  submit: function(){
    hs.auth.login(this.get('email'), this.get('password'), function(err){
      if (err){
        this.showInvalid('password');
      }else{
        this.blur();
        this.clear();
      }
    }, this);
  }
});
