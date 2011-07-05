
dep.require('hs.Controller');
dep.require('hs.settings.views.Settings');
dep.require('hs.settings.views.Default');
dep.require('hs.settings.views.Password');

hs.regController('settings', hs.Controller.extend({
  routes: {
    '!/settings/': 'default',
    '!/settings/password': 'password',
    '!/settings/social': 'social',
    '!/settings/name': 'name'
  },

  authHooked: false,
  loaded: false,

  bootstrap: function(){
    if (!this.loaded) {
      hs.page.finish();
      hs.page = new hs.settings.views.Settings();
      hs.page.render();
      this.loaded = true;
    }
  },
  renderView: function(){
    if (!hs.auth.isAuthenticated()) {
      hs.page.finish();
    } else {
      this.bootstrap();
      this.view.render();
    }
  },
  loadView: function(view){
    if (!this.authHooked) {
      hs.auth.ready(this.renderView, this);
      this.authHooked = true;
    }

    this.view = new view({el: $('#settings #setting')});
    this.renderView();
  },
  highlightLink: function(path) {
    path = '#!/settings/' + path;
    $('#settings #nav a').removeClass('selected');
    $('#settings #nav a[href="' + path + '"]').addClass('selected');
  },
  updateAuth: function(clbk) {
    console.log('updateauth');
  },

  default: function(){
    this.loadView(hs.settings.views.Default);
    this.highlightLink('default');  
  },
  password: function(){
    this.loadView(hs.settings.views.Password);
    this.highlightLink('password');
  },
  social: function(){
    this.loadView(hs.settings.views.Social);
    this.highlightLink('social');
  },
  name: function(){
    this.loadView(hs.settings.views.Name);
    this.highlightLink('name');  
  }
}));
