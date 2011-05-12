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
