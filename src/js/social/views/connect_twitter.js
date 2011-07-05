
dep.require('hs.views.Page');
dep.require('hs.social.views');
dep.provide('hs.social.views.ConnectTwitter');

hs.social.views.ConnectTwitter = hs.views.Page.extend({
  template: 'connect_social',

  render: function(){
    hs.views.Page.prototype.render.apply(this, arguments);

    var res = window.location.hash.split('?');
    if (res.length > 1)
      res = res[1].split('=');
    else
      res = [true, false];

    if (res[0] == 'success') {
      this.$('h1').text('Success!').addClass('success');
      this.$('p').html("You've successfully linked your Twitter account " + 
                       "to your Hipsell account.<br><br>" +
                       '<a href="#!/settings/social">Click here</a> ' +
                       'to go back to the settings page.');
    } else {
      this.$('h1').text('Error').addClass('error');
      this.$('p').html("Something went wrong when we tried to connect " +
                       "your Twitter account to your Hipsell account. " +
                       "You might want to try connecting again.<br><br>" +
                       '<a href="#!/settings/social">Click here</a> ' +
                       'to go back to the settings page.');
    }

  }
});
