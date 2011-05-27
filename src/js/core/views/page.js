//depends: core/views/main.js

// global page view referance, starts as noop
hs.page = {finish: function(){}}

hs.views.Page = hs.views.View.extend({
  el: $('#main'),
  finish: function(){
    $(this.el).html('');
  }
});
