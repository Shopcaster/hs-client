
dep.require('hs.views.Page');
dep.require('hs.settings.views');
dep.provide('hs.settings.views.Password');

hs.settings.views.Password = hs.views.Page.extend({
  template: 'password'
});
