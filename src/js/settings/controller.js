
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

  renderView: function(){
    if (!hs.auth.isAuthenticated()) {
      hs.page.finish();
    } else {
      hs.page.finish();
      hs.page = new hs.settings.views.Settings();
      hs.page.render();
      new this.view({el: $('#settings #setting')}).render();
    }
  },
  loadView: function(view, name){
    this.view = view;
    hs.auth.ready(function() {
      this.renderView();
      this.highlightLink(name);
    }, this);
  },
  highlightLink: function(path) {
    path = '#!/settings/' + path;
    $('#settings #nav a').removeClass('selected');
    $('#settings #nav a[href="' + path + '"]').addClass('selected');
  },

  default: function(){
    this.loadView(hs.settings.views.Default, 'default');
  },
  password: function(){
    this.loadView(hs.settings.views.Password, 'password');
  },
  social: function(){
    this.loadView(hs.settings.views.Social, 'social');
  },
  name: function(){
    this.loadView(hs.settings.views.Name, 'name');
  }
}));
