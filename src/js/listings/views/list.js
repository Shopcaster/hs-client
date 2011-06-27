
dep.require('hs.views.Page');
dep.require('hs.listings.views');

dep.provide('hs.listings.views.List');

hs.listings.views.List = hs.views.Page.extend({
  template: 'listings'
});
