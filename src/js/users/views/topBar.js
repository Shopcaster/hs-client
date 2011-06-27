
dep.require('hs.users.views.Settings');
dep.require('hs.users.views.LoginDialog');

dep.provide('hs.users.views.TopBar');

hs.users.views.TopBar = hs.views.View.extend({
  events: {
    'click .logout': 'logout'
  },
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);

    hs.auth.bind('change:isAuthenticated', this.authChange, this);
    this.authChange(hs.auth.isAuthenticated());

    this.settings = new hs.users.views.Settings();
    this.loginDialog = new hs.users.views.LoginDialog();
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
    $('#top-bar a.login').hide();
    $('#top-bar a.logout').show();
    $('#top-bar a.settings').show();

    this.user = hs.users.User.get();
    this.user.bind('change:name', this.renderLoggedIn, this);

    var name = this.user.get('name');
    if (_.isUndefined(name)){
      $('#top-bar > .width > a.name').html(hs.auth.email
          +' <span id="set-name">(<span class="red">'
          +'set public name!</span>)</span>').show();
    }else{
      $('#top-bar > .width > a.name').text(name).show();
    }

  },
  renderLoggedOut: function(){
    $('#top-bar a.login').show();
    $('#top-bar a.logout').hide();
    $('#top-bar a.settings').hide();
    $('#top-bar > .width > a.name').hide().text('');
  }
});

hs.init(function(){
  hs.users.views.TopBar = new hs.users.views.TopBar({el: $('#top-bar')});
});
