
dep.require('hs.views.Page');
dep.require('hs.about.views');
dep.provide('hs.about.views.About');

hs.about.views.About = hs.views.Page.extend({
  template: 'about'
});
