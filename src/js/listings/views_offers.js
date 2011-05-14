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
      model: this.model
    });
  },
  offersChange: function(){
    //this.render();
  }
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
  initialize: function(){
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
    $('input[name=offer]').bind('mousedown', _.bind(function(e){
      e.preventDefault();
      e.stopPropagation();
      this.focus();
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
    this.model = this.model || new hs.listings.models.Offer();
    this.model.set({
      amount: this.get('amount'),
      listing: this.model
    });
    this.model.save();
    this.hide();
  }
});

