//depends:
// core/views/view.js,
// core/auth.js,
// core/init.js,
// core/views/forms/form.js

dep.require('hs.views.Form');
dep.require('hs.auth');
dep.require('hs.init');

dep.provide('hs.auth.views.AuthForm');

hs.auth.views = {};

hs.auth.views.AuthForm = hs.views.Form.extend({
  fields: [{
      'name': 'email',
      'type': 'email',
      'placeholder': 'Email',
      'hide': true
    },{
      'name': 'password',
      'type': 'password',
      'placeholder': 'Password',
      'hide': true
  }],
  render: function(){
    hs.views.Form.prototype.render.apply(this, arguments);
    if (!hs.auth.isAuthenticated())
      this.$('[name=email]').show();
    hs.auth.bind('change:isAuthenticated', function(isA){
      if (isA){
        this.$('[name=email]').hide();
        this.$('[name=password]').hide();
      }else{
        this.$('[name=email]').show();
      }
    }, this);
  },
  renderLogin: function(){
    this.$('[name=password]').show();
  },
  _submit: function(e){
    e.preventDefault();

    this._validate(function(valid){
      var sub = function(){
        if (this.submit) this.submit();
        this.trigger('submit');
      }
      if (valid){
        if (hs.auth.isAuthenticated()){
          sub.call(this);
        }else if (this.$('[name=password]:visible').length){
          this.login(sub, this);
        }else{
          this.signup(sub, this);
        }
      }
    }, this);
  },
  login: function(clbk, context){
    var email = this.$('[name=email]').val(),
        password = this.$('[name=password]').val();

    hs.auth.login(email, password, _.bind(function(err){
      if (err)
        this.showInvalid('password');
      else if (clbk)
        clbk.call(context);
    }, this));
  },
  signup: function(clbk, context){
    var email = this.$('[name=email]').val();

    hs.auth.signup(email, _.bind(function(err){
      if (err)
        this.renderLogin();
      else if (clbk)
        clbk.call(context);
    }, this));
  },
  validatePassword: function(password, clbk){
    clbk(this.$('[name=password]:visible').length == 0
        || (password && password.length > 0));
  },
  validateEmail: function(email, clbk){
    clbk(this.$('[name=email]:visible').length == 0
        || (email
          && /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)));
  }
});
