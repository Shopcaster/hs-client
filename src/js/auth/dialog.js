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
  initialize: function(){
    hs.views.Form.prototype.initialize.apply(this, arguments);
    $('body').click(_.bind(function(e){
      console.log('body click', $(e.target).selector);
      if ($('#loginForm').children($(e.target).selector).length)
        return e.preventDefault();
      this.hide();
    }, this));
  },
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
    // $('#loginForm').fadeIn(200);
    $('#loginForm').show();
    $('a.login').addClass('open');
  },
  hide: function(){
    // $('#loginForm').fadeOut(200);
    $('#loginForm').hide();
    $('a.login').removeClass('open');
  },
  toggle: function(){
    if($('#loginForm:visible').length)
      this.hide();
    else
      this.show();
  }
});
