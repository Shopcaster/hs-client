//depends: auth/views.js

hs.listings.views = hs.listings.views || new Object();

hs.listings.views.Offers = hs.views.View.extend({
  template: 'offers',
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
    this.listing = this.options.listing;
    if (_.isUndefined(this.listing))
      throw(new Error('OfferForm requires a listing'));
  },
  render: function(){
    hs.views.View.prototype.render.apply(this, arguments);
    this.offerForm = new hs.listings.views.OfferForm({
      el: this.$('#offerForm'),
      listing: this.listing
    });
  }
});


hs.listings.views.OfferForm = hs.auth.views.AuthForm.extend({
  _renderWith: 'append',
  template: 'offerForm',
  fields: [{
    'name': 'amount',
    'type': 'text',
    'placeholder': 'Amount'
  }].concat(hs.auth.views.AuthForm.prototype.fields),
  events: _.extend({
    'click input[name=offer]': 'makeOffer',
    'click #offerSubmit': '_submit'
  }, hs.auth.views.AuthForm.prototype.events),
  initialize: function(){
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
    this.listing = this.options.listing;
    if (_.isUndefined(this.listing))
      throw(new Error('OfferForm requires a listing'));
  },
  render: function(){
    hs.auth.views.AuthForm.prototype.render.apply(this, arguments);
    $('body').click(_.bind(this.blue, this));
    $('#offerForm').click(function(e){e.stopPropagation()});
  },
  focus: function(){
    if (!this.rendered) this.render();
    $('#offerForm').addClass('open').fadeIn(200);
  },
  blur: function(){
    $('#offerForm').fadeOut(200).removeClass('open');
  },
  makeOffer: function(e){
    e.preventDefault();
    e.stopPropagation();
    this.focus();
  },
  validateAmount: function(value, clbk){
    clbk(/^\d+$/.test(value.replace('$', '')));
  },
  submit: function(){
    this.model = this.model || new hs.listings.models.Offer();
    this.model.set({
      amount: this.get('amount'),
      listing: this.listing.id
    });
    this.model.save();
    this.hide();
  }
});

