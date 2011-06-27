
dep.require('hs.views.View');
dep.require('hs.users.views');

dep.provides('hs.users.views.User');

hs.users.views.User = hs.views.View.extend({
  template: 'user',

  modelEvents: {
    'change:name': 'updateName',
    'change:avatar': 'updateAvatar'
  },

  updateName: function(){
    if (this.model.get('name'))
      this.$('.name').text(this.model.get('name'));
  },

  updateAvatar: function(){
    this.$('.avatar').attr('src', this.model.getAvatarUrl(30));
  }
});
