
dep.require('hs.views.Page');
dep.require('hs.settings.views');
dep.provide('hs.settings.views.Social');

hs.settings.views.Social = hs.views.Page.extend({
  template: 'social',

  prepContext: function(context){
    var user = hs.users.User.get();

    context.fb = user.get('fb');
    context.twitter = user.get('twitter');
    context.linkedin = user.get('linkedin');

    context.server = '';
  }
});
