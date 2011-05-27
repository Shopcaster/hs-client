//depends: offers/views/main.js, auth/views.js

hs.offers.views.Form = hs.auth.views.AuthForm.extend({
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
    this.model = new hs.offers.Offer({
      listing: this.listing.id
    });
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
    this.model.set({
      creator: hs.auth.getUser(),
      created: new Date(),
      amount: this.get('amount').replace('$', '')
    });
    this.model.save();
    this.clear();
    this.model = new hs.offers.Offer({
      listing: this.listing.id
    });
    this.blur();
  }
});
