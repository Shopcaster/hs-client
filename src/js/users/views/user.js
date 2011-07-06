
dep.require('hs.views.View');
dep.require('hs.users.views');

dep.provide('hs.users.views.User');
dep.provide('hs.users.views.InlineUser');

hs.users.views.User = hs.views.View.extend({
  template: 'user',

  modelEvents: {
    'change:name': 'updateName',
    'change:avatar': 'updateAvatar',
    'change:presence': 'updatePresence',
    'change:fb': 'updateFb',
    'change:twitter': 'updateTwitter',
    'change:linkedin': 'updateLinkedin'
  },

  updateName: function(){
    if (this.model.get('name'))
      this.$('.name').text(this.model.get('name'));
  },

  updateAvatar: function(){
    this.$('.avatar').attr('src', this.model.getAvatarUrl(75));
  },

  updatePresence: function(){
    var node = this.$('.presence').removeClass('away online offline');
    switch (this.model.get('presence')){
      case 0:
        node.addClass('offline');
        node.attr('title', 'Offline');
      break;
      case 1:
        node.addClass('online');
        node.attr('title', 'Online');
      break;
      case 2:
        node.addClass('away'); 
        node.attr('title', 'Away');
      break;
    }
  },

  updateFb: function(){
    this.$('.fb').attr('href', this.model.get('fb')).show();
  },

  updateTwitter: function(){
    this.$('.twitter').attr('href', this.model.get('twitter')).show();
  },

  updateLinkedin: function(){
    this.$('.linkedin').attr('href', this.model.get('linkedin')).show();
  }
});

hs.users.views.InlineUser = hs.users.views.User.extend({
  template: 'inlineUser',

  modelEvents: {
    'change:name': 'updateName',
    'change:avatar': 'updateAvatar',
    'change:presence': 'updatePresence'
  },

  updateAvatar: function(){
    this.$('.avatar').attr('src', this.model.getAvatarUrl(30));
  }
});
