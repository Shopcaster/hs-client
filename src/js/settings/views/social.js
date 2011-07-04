
dep.require('hs.views.Page');
dep.require('hs.settings.views');
dep.provide('hs.settings.views.Social');

hs.settings.views.Social = hs.views.Page.extend({
  template: 'social',

  _buildl: function(h, t, l){
    var ret = '<a target="_blank" href="' + h + '"><img src="/img/' + t +
              '.png" alt="' + l + '"></a>';
    return ret;
  },
  _buildu: function(t, l){
    var enc = encodeURIComponent;
    var loc = window.location;
    loc = (loc.protocol + '//' + loc.host);
    var s = conf.server;

    var ret = s.protocol + '://' + s.host + ':' + s.port + s.path;
    ret += t + '/connect';
    ret += '?email=' + enc(hs.auth.email) +
           '&password=' + enc(hs.auth.pass) +
           '&return=' + enc(loc + '#!/social/connect/' + t);

    ret = '<a href="' + ret + '"><img src="/img/' + t +
          '.png" alt="' + l + '"></a>';

    return ret;
  },

  render: function(){
    hs.views.Page.prototype.render.apply(this, arguments);

    var user = hs.users.User.get();

    var fb = user.get('fb');
    var twitter = user.get('twitter');
    var linkedin = user.get('linkedin');

    // Handle Facebook
    if (fb) {
      this.$('#linked').append($(this._buildl(fb, 'fb', 'Facebook')));
    } else {
      this.$('#unlinked').append($(this._buildu('fb', 'Facebook')));
    }
    // Handle Twitter
    if (twitter) {
      this.$('#linked').append($(this._buildl(twitter, 'twitter', 'Twitter')));
    } else {
      this.$('#unlinked').append($(this._buildu('twitter', 'Twitter')));
    }
    // Handle Linkedin
    if (linkedin) {
      this.$('#linked').append($(this._buildl(linkedin, 'linkedin', 'LinkedIn')));
    } else {
      this.$('#unlinked').append($(this._buildu('linkedin', 'LinkedIn')));
    }
  }
});
