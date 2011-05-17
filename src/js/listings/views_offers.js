//depends: auth/views.js

hs.listings.views = hs.listings.views || new Object();

hs.listings.views.Offers = hs.views.View.extend({
  template: 'offers',
  modelEvents: {
    'change:offers': 'offersChange'
  },
  render: function(){
    this._tmplContext.offers = this.model.get('offers').toJSON();
    hs.views.View.prototype.render.apply(this, arguments);
    this.offerForm = this.offerForm || new hs.listings.views.OfferForm({
      el: this.$('#offerForm'),
      listing: this.model
    });
    this.renderOffers();
  },
  offerViews: new Object(),
  renderOffers: function(){
    var newOffers = this.model.get('offers');
    var newOfferIds = [];
    // add new offers
    _.each(newOffers, _.bind(function(o, i){
      var offer = newOffers.at(i);
      newOfferIds.push(offer.id);
      if (_.isUndefined(this.offerViews[offer.id])){
        this.offerViews[offer.id] = new hs.listings.views.Offer({
          el: $('#offerList'),
          model: offer
        });
      }
    }, this));
    // remove old offers
    _.each(_.keys(this.offerViews), _.bind(function(id){
      id = parseInt(id);
      if (!_.include(newOfferIds, id))
        delete this.offerViews[id];
    }, this));
    // render offers
    _.each(this.offerViews, _.bind(function(view){
      if (!view.rendered) view.render();
    }, this));
  },
  offersChange: function(){
    this.renderOffers();
  }
});


hs.listings.views.Offer = hs.views.View.extend({
  _renderWith: 'append',
  template: 'offer',
  modelEvents: {
    'change:amount': 'amountChange',
    'change:creator': 'creatorChange'
  },
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
    if (this.model.get('creator'))
      this.changeCreator();
    if (this.model.get('amount'))
      this.changeAmount();
  },
  render: function(){
    hs.views.View.prototype.render.apply(this, arguments);
    this.$('.offer').hover(_.bind(this.hoverOver, this), _.bind(this.hoverOut, this));
  },
  creatorChange: function(){
    this.creator = this.model.get('creator');
    this.creator.bind('change:avatar', _.bind(this.avatarChange, this));
    this.creator.bind('change:name', _.bind(this.nameChange, this));
    if (this.creator.get('avatar'))
      this.avatarChange();
    if (this.creator.get('name'))
      this.nameChange();

    var userId = hs.auth.getUser().get('id');
    if (this.creator.get('id') == userId){
      this.owned = true;
    }else if (this.model.get('listing').get('creator').get('id') == userId){
      this.listingOwned = true;
    }
    this.controlsChange();
  },
  controlsChange: function(){
    hs.log(this)
    if (this.owned)
      this.$('.controls').html('<a href="#" class="button withdraw">');
  },
  amountChange: function(){
    this.$('.amount').text(this.model.get('amount'));
  },
  avatarChange: function(){
    this.$('.avatar').attr('src', this.creator.getAvatarUrl(40));
  },
  nameChange: function(){
    this.$('.name').text(this.creator.get('name'));
  },
  hoverOver: function(){},
  hoverOut: function(){}
});


hs.listings.views.OfferForm = hs.auth.views.AuthForm.extend({
  _renderWith: 'append',
  template: 'offerForm',
  fields: [{
    'name': 'amount',
    'type': 'text',
    'placeholder': 'Make an Offer'
  }].concat(hs.auth.views.AuthForm.prototype.fields),
  events: _.extend({
    'focus [name=amount]': 'amoutFocus',
    'blur [name=amount]': 'amoutBlur'
  }, hs.auth.views.AuthForm.prototype.events),
  initialize: function(opts){
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
    $('input[name=offer]').bind('mousedown', _.bind(function(e){
      e.preventDefault();
      e.stopPropagation();
      this.focus();
    }, this));
    this.listing = opts.listing;
    this.model = new hs.listings.models.Offer({
      listing: this.listing.id
    });
    this.bind('change:amount', _.bind(function(amount){
      this.model.set({amount: amount.replace('$', '')});
    }, this));
  },
  render: function(){
    hs.auth.views.AuthForm.prototype.render.apply(this, arguments);
    $('body').click(_.bind(this.blur, this));
    $('#offerForm').click(function(e){e.stopPropagation()});
  },
  focus: function(){
    if (!this.rendered) this.render();
    $('#offerForm').addClass('open').fadeIn(200);
    this.$('[name=amount]').focus();
  },
  blur: function(){
    $('#offerForm').fadeOut(200).removeClass('open');
  },
  makeOffer: function(e){
    e.preventDefault();
    e.stopPropagation();
    hs.log('click');
    this.focus();
  },
  amoutFocus: function(){
    if (this.$('[name=amount]').val() == '')
      this.$('[name=amount]').val('$');
  },
  amoutBlur: function(){
    if (this.$('[name=amount]').val() == '$')
      this.$('[name=amount]').val('');
  },
  validateAmount: function(value, clbk){
    clbk(/^\d+$/.test(value.replace('$', '')));
  },
  submit: function(){
    this.model.set({creator: hs.auth.getUser()});
    this.model.save();
    this.clear();
    this.model = new hs.listings.models.Offer({
      listing: this.listing.id
    });
    this.blur();
  }
});

