//depends: core/views/view.js

dep.require('hs.views.View');

dep.provide('hs.page');
dep.provide('hs.views.Page');

// global page view referance, starts as noop
hs.page = {finish: function(){}}

hs.views.Page = hs.views.View.extend({
  el: $('#main'),
  finish: function(){
    $(this.el).html('');
  }
});
