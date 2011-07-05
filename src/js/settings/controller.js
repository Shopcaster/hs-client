
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

  loaded: false,

  bootstrap: function(){
    if (!this.loaded) {
      hs.page.finish();
      hs.page = new hs.settings.views.Settings();
      hs.page.render();
      this.loaded = true;
    }
  },
  loadView: function(view){
    //if the user isn't logged in we can't do settings
    if (!hs.users.User.get()) {
      hs.page.finish();
      return;
    }

    this.bootstrap();
    new view({el: $('#settings #setting')}).render();
  },
  highlightLink: function(path) {
    path = '#!/settings/' + path;
    $('#settings #nav a').removeClass('selected');
    $('#settings #nav a[href="' + path + '"]').addClass('selected');
  },


  default: function(){
    this.highlightLink('default');
    this.loadView(hs.settings.views.Default);
  },
  password: function(){
    this.highlightLink('password');
    this.loadView(hs.settings.views.Password);
  },
  social: function(){
    this.highlightLink('social');
    this.loadView(hs.settings.views.Social);
  },
  name: function(){
    this.highlightLink('name');
    this.loadView(hs.settings.views.Name);
  }
}));
