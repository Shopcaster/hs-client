//depends: offers/views/main.js, core/views/mixins/dialog.js, auth/views.js

hs.offers.views.Form = hs.auth.views.AuthForm.mixin(hs.views.mixins.Dialog).extend({
  template: 'offerForm',
  focusSelector: 'input[name=offer]',
  fields: [{
    'name': 'amount',
    'type': 'text',
    'placeholder': 'Make an Offer'
  }].concat(hs.auth.views.AuthForm.prototype.fields),
  events: _.extend({
    'focus [name=amount]': 'amountFocus',
    'blur [name=amount]': 'amountBlur'
  }, hs.auth.views.AuthForm.prototype.events),
  initialize: function(opts){
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
    this.listing = opts.listing;
    this.model = new hs.offers.Offer({
      listing: this.listing
    });
  },
  amountFocus: function(){
    if (this.$('[name=amount]').val() == '')
      this.$('[name=amount]').val('$');
  },
  amountBlur: function(){
    if (this.$('[name=amount]').val() == '$')
      this.$('[name=amount]').val('');
  },
  focus: function(){
    hs.views.mixins.Dialog.focus.apply(this, arguments);
    this.$('[name=amount]').focus();
  },
  validateAmount: function(value, clbk){
    clbk(/^\d+$/.test(value.replace('$', '')));
  },
  submit: function(){
    this.model.set({
      creator: hs.auth.getUser(),
      amount: parseFloat(this.get('amount').replace('$', ''))
    });
    this.model.save();
    this.clear();
    this.model = new hs.offers.Offer({
      listing: this.listing
    });
    this.blur();
  }
});
