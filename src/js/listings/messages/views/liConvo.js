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
  events: _.extend({
    'click .accept': 'accept',
    'click .cancel': 'cancel'
  }, hs.views.View.prototype.events),
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
    if (this.model.get('creator'))
      this.creatorChange();
    if (this.model.get('amount'))
      this.amountChange();
  },
  render: function(){
    hs.views.View.prototype.render.apply(this, arguments);
    this.initConvo();
  },
  creatorChange: function(){
    this.creator = this.model.get('creator');

    this.creator.bind('change:avatar', this.avatarChange, this);
    if (this.creator.get('avatar'))
      this.avatarChange();

    this.creator.bind('change:name', this.nameChange, this);
    if (this.creator.get('name'))
      this.nameChange();

    this.listingOwned = false;
    this.owned = false;
    if (hs.auth.isAuthenticated()){
      var userId = hs.auth.getUser()._id;
      if (this.creator._id == userId){
        this.owned = true;
      }
      this.model.withRel('listing.creator', function(listingCreator){
        if (listingCreator._id == userId){
          this.listingOwned = true;
          this.initConvo();
        }
      }, this);
    }
    this.initConvo();
  },
  initConvo: function(){
    this.canMessage = (this.owned || this.listingOwned) && this.rendered;

    if (this.canMessage){
      this.el.addClass('hasMessages');

      var messages = this.model.get('messages').length;
      if (this.$('.messagesCount').length == 0)
        this.$('.actions').prepend('<a href="javascript:;" class="messagesCount">'
            +messages+' Messages</a> | '
            +'<a href="javascript:;">Send a Message</a> | ');
      else
        this.$('.messagesCount').text(messages+' Messages');

      this.messages = this.messages || new hs.messages.views.ConvoDialog({
        model: this.model,
        focusSelector: '#liConvo-'+this.model._id,
        appendTo: this.el
      });

    }else{
      this.$('.messages').remove();
    }
  },
  messagesChange: function(){
    if (this.canMessage){
      this.el.animate({backgroundColor: '#fffaaf'}, 250, function(){
        $(this).animate({backgroundColor: '#F1F1F2'}, 250);
      });
      this.$('.messagesCount').text(this.model.get('messages').length+' Messages');
    }
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
    $('#liConvo-'+this.model._id).remove();
    this.trigger('removed');
  },
  lock: function(){
    this.locked = true;
  },
  unlock: function(){
    this.locked = false;
  }
});
