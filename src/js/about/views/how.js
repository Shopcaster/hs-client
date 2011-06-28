
dep.require('hs.views.Page');
dep.require('hs.about.views');
dep.provide('hs.about.views.How');

hs.about.views.How = hs.views.Page.extend({
  template: 'howItWorks'
});
