
dep.require('hs.views.Page');
dep.require('hs.settings.views');
dep.provide('hs.settings.views.Default');

hs.settings.views.Default = hs.views.Page.extend({
  template: 'default'
});
