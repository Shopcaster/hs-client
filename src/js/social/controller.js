
dep.require('hs.Controller');
dep.require('hs.social.views.ConnectFacebook');
dep.require('hs.social.views.ConnectTwitter');

hs.regController('social', hs.Controller.extend({
  routes: {
    '!/social/connect/fb:status': 'fb',
    '!/social/connect/twitter:status': 'twitter',
    '!/social/connect/linkedin:status': 'linkedin',
  },

  fb: function(){
    hs.page.finish();
    hs.page = new hs.social.views.ConnectFacebook();
    hs.page.render();
  },
  twitter: function(){
    hs.page.finish();
    hs.page = new hs.social.views.ConnectTwitter();
    hs.page.render();
  },
  linkedin: function(){
    hs.page.finish();
    //hs.page = new hs.social.views.ConnectLinkedIn();
    hs.page.render();
  }
}));
