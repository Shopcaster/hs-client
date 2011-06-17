//depends: listings/offers/messages/views/main.js, core/views/view.js

hs.messages.views.Message = hs.views.View.extend({
  template: 'message',
  modelEvents: {
    'change:message': 'messageChange',
    'change:creator': 'creatorChange',
    'change:created': 'createdChange'
  },
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
    if (this.model.get('creator'))
      this.creatorChange();
  },
  creatorChange: function(){
    this.creator = this.model.get('creator');
    this.creator.bind('change:avatar', _.bind(this.avatarChange, this));
    this.creator.bind('change:name', _.bind(this.nameChange, this));
    if (this.creator.get('avatar'))
      this.avatarChange();
    if (this.creator.get('name'))
      this.nameChange();
  },
  messageChange: function(){
    this.$('.messageBody').text(this.model.get('message'));
  },
  avatarChange: function(){
    this.$('.avatar').attr('src', this.creator.getAvatarUrl(30));
  },
  nameChange: function(){
    this.$('.name').text(this.creator.get('name'));
  },
  createdChange: function(){
    var since = _.since(this.model.get('created'));
    this.$('.created').text(since.num+' '+since.text);
  },
  remove: function(){
    $('#message-'+this.model._id).remove();
    this.trigger('removed');
  }
});
