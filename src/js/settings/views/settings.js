
dep.require('hs.views.Page');
dep.require('hs.settings.views');
dep.provide('hs.settings.views.Settings');

hs.settings.views.Settings = hs.views.Page.extend({
  template: 'settings'
});
