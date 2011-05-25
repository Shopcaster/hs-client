//depends: inquiries/views/main.js, core/views.js

hs.inquiries.views.Inquiry = hs.views.View.extend({
  template: 'inquiry',
  modelEvents: {
    'change:amount': 'amountChange',
    'change:creator': 'creatorChange',
    'change:created': 'createdChange'
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
  creatorChange: function(){
    this.creator = this.model.get('creator');
    this.creator.bind('change:avatar', _.bind(this.avatarChange, this));
    this.creator.bind('change:name', _.bind(this.nameChange, this));
    if (this.creator.get('avatar'))
      this.avatarChange();
    if (this.creator.get('name'))
      this.nameChange();

    this.listingOwned = false;
    this.owned = false;
    if (hs.auth.isAuthenticated()){
      var userId = hs.auth.getUser().get('id');
      if (this.creator.get('id') == userId){
        this.owned = true;
      }else if (this.model.get('listing').get('creator').get('id') == userId){
        this.listingOwned = true;
      }
    }
    this.controlsChange();
  },
  controlsChange: function(){
    if (this.owned){
      this.$('.action').html('<a href="#" class="button withdraw">Withdraw</a>');
    }else if (this.listingOwner){
      this.$('.action').html('<a href="#" class="button accept">Accept</a>');
    }else{
      this.$('.action').html('');
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
    var since = Date.since(this.model.get('created'));
    this.$('.created').text(since.num+' '+since.text);
  },
  accept: function(e){
    e.preventDefault();
    this.model.accept();
  },
  withdraw: function(e){
    e.preventDefault();
    this.model.del();
  },
  remove: function(){
    $('#inquiry-'+this.model.get('id')).remove();
    this.trigger('removed');
  }
});
