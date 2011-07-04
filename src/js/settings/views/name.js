
dep.require('hs.views.Page');
dep.require('hs.settings.views');
dep.provide('hs.settings.views.Name');

hs.settings.views.Name = hs.views.Page.extend({
  template: 'name'
});
