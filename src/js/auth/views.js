//depends: core/views.js,
//    auth/main.js,
//    core/init.js,
//    auth/login.js,
//    auth/settings.js

hs.auth = hs.auth || new Object();
hs.auth.views = new Object();

hs.auth.views.Login = hs.views.View.extend({
  appendTo: $('#top-bar')[0],
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
    hs.auth.bind('change:isAuthenticated', _.bind(this.authChange, this));
    this.authChange(hs.auth.isAuthenticated());

    $('#top-bar .login').click(_.bind(this.login, this));
    $('#top-bar .logout').click(_.bind(this.logout, this));
    $('#top-bar .name').click(_.bind(this.settings, this));
  },
  settings: function(e){
    e.preventDefault();
    e.stopPropagation();
    this.settingsForm = this.settingsForm || new hs.auth.SettingsForm();
    this.settingsForm.toggle();
    this.settingsForm.bind('submit', _.bind(function(){
      this.settingsForm.unbind(arguments.callee);
      this.renderLoggedIn();
    }, this));
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
  authChange: function(){
    if (hs.auth.isAuthenticated())
      this.renderLoggedIn();
    else
      this.renderLoggedOut();
  },
  renderLoggedIn: function(){
    this.user = hs.auth.getUser();
    var name = this.user.get('name');

    $('#top-bar a.login').hide();
    $('#top-bar a.logout').show();

    if (_.isUndefined(name)){
      $('#top-bar a.name').html(hs.auth.email
          +' <span id="set-name">(<span class="red">'
          +'set your name!</span>)</span>').show();
    }else{
      $('#top-bar a.name').text(name).show();
    }

  },
  renderLoggedOut: function(){
    $('#top-bar a.login').show();
    $('#top-bar a.logout').hide();
    $('#top-bar a.name').hide().text('');
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