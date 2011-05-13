//depends: core/views.js, auth/main.js, core/init.js, auth/dialog.js

hs.auth = hs.auth || new Object();
hs.auth.views = new Object();

hs.auth.views.Login = hs.views.View.extend({
  el: $('#top-bar')[0],
  initialize: function(){
    hs.auth.bind('change:isAuthenticated', _.bind(this.authChange, this));
    this.authChange(hs.auth.isAuthenticated());
  },
  events: {
    'click a.login': 'login',
    'click a.logout': 'logout'
  },
  login: function(e){
    e.preventDefault();
    e.stopPropagation();
    this.loginForm = this.loginForm || new hs.auth.LoginForm();
    this.loginForm.toggle();
  },
  logout: function(e){
    e.preventDefault();
    hs.auth.logout();
  },
  authChange: function(isAuthed){
    if (isAuthed)
      this.renderLoggedIn();
    else
      this.renderLoggedOut();
  },
  renderLoggedIn: function(){
    $('#top-bar a.login').hide();
    $('#top-bar a.logout').show();
    $('#top-bar a.email').text(hs.auth.email).show();
  },
  renderLoggedOut: function(){
    $('#top-bar a.login').show();
    $('#top-bar a.logout').hide();
    $('#top-bar a.email').hide().text('');
  }
});

hs.init(function(){
  hs.auth.views.login = new hs.auth.views.Login();
});


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
    hs.auth.bind('change:isAuthenticated', _.bind(function(isA){
      if (isA){
        this.$('[name=email]').hide();
        this.$('[name=password]').hide();
      }else{
        this.$('[name=email]').show();
      }
    }, this));
  },
  renderLogin: function(){
    this.$('[name=password]').fadeIn(100);
  },
  _submit: function(e){
    e.preventDefault();
    var super = _.bind(Function.prototype.apply,
        hs.views.Form.prototype._submit, this, arguments);
    if (hs.auth.isAuthenticated())
      return super();
    if (this.$('[name=password]:visible').length)
      this.login(super);
    else
      this.signup(super);
  },
  login: function(clbk){
    var email = this.$('[name=email]').val(),
        password = this.$('[name=password]').val();

    hs.auth.login(email, password, _.bind(function(err){
      if (err)
        this.showInvalid('password');
      else if (clbk)
        clbk();
    }, this));
  },
  signup: function(clbk){
    var email = this.$('[name=email]').val();

    hs.auth.signup(email, _.bind(function(err){
      if (err)
        this.renderLogin();
      else if (clbk)
        clbk();
    }, this));
  }
});