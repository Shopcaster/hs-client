
dep.require('hs.views.View');
dep.require('hs.users.views');

dep.provide('hs.users.views.User');
dep.provide('hs.users.views.InlineUser');

hs.users.views.User = hs.views.View.extend({
  template: 'user',

  modelEvents: {
    'change:name': 'updateName',
    'change:avatar': 'updateAvatar',
    'change:presence': 'updatePresence'
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
  }
});

hs.users.views.InlineUser = hs.users.views.User.extend({
  template: 'inlineUser',

  updateAvatar: function(){
    this.$('.avatar').attr('src', this.model.getAvatarUrl(30));
  }
});
