//depends: offers/views/main.js, core/views/forms/dialog.js

hs.offers.views.Form = hs.views.AuthFormDialog.extend({
  template: 'offerForm',
  focusFieldName: 'amount',
  fields: [{
    'name': 'amount',
    'type': 'text',
    'placeholder': 'Make an Offer'
  }].concat(hs.views.AuthFormDialog.prototype.fields),
  events: _.extend({
    'focus [name=amount]': 'amoutFocus',
    'blur [name=amount]': 'amoutBlur'
  }, hs.views.AuthFormDialog.prototype.events),
  initialize: function(opts){
    hs.views.AuthFormDialog.prototype.initialize.apply(this, arguments);
    this.listing = opts.listing;
    this.model = new hs.offers.Offer({
      listing: this.listing.id
    });
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
