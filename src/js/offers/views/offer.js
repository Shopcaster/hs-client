//depends: offers/views/main.js, core/views/view.js

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
    'click .accept': 'accept'
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
    if (this.owned){
      this.$('.action').html('<a href="#" class="withdraw">Withdraw</a>');
    }else if (this.listingOwned){
      this.$('.action').html('<a href="#" class="accept">Accept</a>');
    }else{
      this.$('.action').html('');
    }
    this.initConvo();
  },
  initConvo: function(){
    if ((this.owned || this.listingOwned) && this.rendered){
      // this.$('.clicky').show();
      this.el.addClass('hasMessages');
      this.messages = this.messages || new hs.messages.views.Conversation({
        model: this.model,
        focusSelector: '#offer-'+this.model._id,
        appendTo: this.el
      });
    }
  },
  messagesChange: function(){
    // hs.log('animating');
    this.el.animate({backgroundColor: '#fffaaf'}, 250, function(){
      $(this).animate({backgroundColor: '#F1F1F2'}, 250);
    });
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
    this.model.accept();
  },
  withdraw: function(e){
    e.preventDefault();
    this.model.destroy();
  },
  remove: function(){
    $('#offer-'+this.model._id).remove();
    this.trigger('removed');
  }
});
