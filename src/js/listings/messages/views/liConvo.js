//depends: core/views/view.js,
//         listings/messages/views/main.js,
//         listings/messages/views/convo.js

hs.messages.views.LIConvo = hs.views.View.extend({
  template: 'liConvo',

  modelEvents: {
    'change:creator': 'creatorChange',
    'change:created': 'createdChange',
    'change:messages': 'messagesChange'
  },

  // events: _.extend({
  //   'click .accept': 'accept',
  //   'click .cancel': 'cancel'
  // }, hs.views.View.prototype.events),

  creatorChange: function(){
    this.creator = this.model.get('creator');

    this.creator.bind('change:avatar', this.avatarChange, this);
    if (this.creator.get('avatar')) this.avatarChange();

    this.creator.bind('change:name', this.nameChange, this);
    if (this.creator.get('name')) this.nameChange();
  },

  messagesChange: function(){
    var messages = this.model.get('messages').length;

    if (this.$('.messagesCount').length == 0)
      this.$('.actions').prepend('<a href="javascript:;" class="messagesCount">'
          +messages+' Messages</a> | '
          +'<a href="javascript:;">Send a Message</a>');
    else
      this.$('.messagesCount').text(messages+' Messages');

    this.messages = this.messages || new hs.messages.views.ConvoDialog({
      model: this.model,
      focusSelector: '#liConvo-'+this.model._id,
      appendTo: this.el
    });

    this.el.animate({backgroundColor: '#fffaaf'}, 250, function(){
      $(this).animate({backgroundColor: '#F1F1F2'}, 250);
    });
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

  lock: function(){
    this.locked = true;
  },

  unlock: function(){
    this.locked = false;
  }
});
