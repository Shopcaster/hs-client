//depends: listings/offers/views/main.js, core/views/view.js

hs.offers.views.Offer = hs.views.View.extend({
  template: 'offer',
  modelEvents: {
    'change:amount': 'amountChange',
    'change:creator': 'creatorChange',
    'change:created': 'createdChange',
    'change:messages': 'messagesChange'
  },
  events: _.extend({
    'click .withdraw': 'withdraw',
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
          this.controlsChange();
        }
      }, this);
    }
    this.controlsChange();
  },
  controlsChange: function(){

    if (this.locked && this.listingOwned && this.$('.cancel').length == 0)
      this.$('.actions').append('<a href="javascript:;" '
          +'class="cancel dontOpen">Cancel</a> ');
    else if (!this.locked || !this.listingOwned)
      this.$('.cancel').remove();

    if (!this.locked && this.owned && this.$('.withdraw').length == 0)
      this.$('.actions').append('<a href="javascript:;" '
          +'class="withdraw dontOpen">Withdraw</a> ');
    else if (this.locked || !this.owned)
      this.$('.withdraw').remove();

    if (!this.locked && this.listingOwned && this.$('.accept').length == 0)
      this.$('.actions').append('<a href="javascript:;" '
          +'class="accept dontOpen">Accept</a> ');
    else if (this.locked || !this.listingOwned)
      this.$('.accept').remove();

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

      this.messages = this.messages || new hs.messages.views.Conversation({
        model: this.model,
        focusSelector: '#offer-'+this.model._id,
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
  amountChange: function(){
    this.$('.amount').text('$'+this.model.get('amount'));
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
  accept: function(e){
    e.preventDefault();
    e.stopPropagation();
    if (this.locked) return;
    this.model.accept();
    this.controlsChange();
  },
  withdraw: function(e){
    e.preventDefault();
    e.stopPropagation();
    if (this.locked) return;
    this.model.destroy();
  },
  cancel: function(e){
    e.preventDefault();
    e.stopPropagation();
    this.model.unaccept();
  },
  remove: function(){
    $('#offer-'+this.model._id).remove();
    this.trigger('removed');
  },
  lock: function(){
    this.locked = true;
    this.controlsChange();
  },
  unlock: function(){
    this.locked = false;
    this.controlsChange();
  }
});
