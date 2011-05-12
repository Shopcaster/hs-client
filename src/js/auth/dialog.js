//depends: main.js, auth/tmpl/dialog.tmpl, core/forms/views.js, auth/main.js

hs.auth.LoginForm = hs.views.Form.extend({
  _renderWith: 'append',
  el: $('#top-bar .width'),
  template: 'loginForm',
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
    hs.auth.login(this.values.email, this.values.password, _.bind(function(err){
      if (err){
        console.log(err);
        if (err.message == 'invalid:password')
          this.showInvalid('password');
      }else{
        this.hide();
      }
    }, this));
  },
  show: function(){
    if (!this.rendered) this.render();
    $('#loginForm').fadeIn(200);
  },
  hide: function(){
    $('#loginForm').fadeOut(200);
  },
  toggle: function(){
    if($('#loginForm:visible').length)
      this.hide();
    else
      this.show();
  }
});
