
dep.require('hs.views.View');
dep.require('hs.users.views');

dep.provide('hs.users.views.User');

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
      case 1:
        node.addClass('online');
      case 2:
        node.addClass('away'); 
    }
  }
});
