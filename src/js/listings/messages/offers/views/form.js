(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  dep.require('hs.auth.views.AuthForm');
  dep.require('hs.views.mixins.Dialog');
  dep.require('hs.offers.views');
  dep.provide('hs.offers.views.Form');
  hs.offers.views.Form = hs.auth.views.AuthForm.mixin(hs.views.mixins.Dialog).extend({
    template: 'offerForm',
    fields: [
      {
        'name': 'amount',
        'type': 'text',
        'placeholder': 'Make an Offer'
      }
    ].concat(hs.auth.views.AuthForm.prototype.fields),
    events: _.extend({
      'focus [name=amount]': 'amountFocus',
      'blur [name=amount]': 'amountBlur'
    }, hs.auth.views.AuthForm.prototype.events),
    initialize: function(opts) {
      hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
      return this.listing = opts.listing;
    },
    amountFocus: function() {
      if (this.$('[name=amount]').val() === '') {
        return this.$('[name=amount]').val('$');
      }
    },
    amountBlur: function() {
      if (this.$('[name=amount]').val() === '$') {
        return this.$('[name=amount]').val('');
      }
    },
    focus: function() {
      if (this.disabled) {
        return;
      }
      hs.views.mixins.Dialog.focus.apply(this, arguments);
      return this.$('[name=amount]').focus();
    },
    validateAmount: function(value, clbk) {
      return clbk(/^\d+$/.test(value.replace('$', '')));
    },
    submit: function() {
      if (this.disabled) {
        return;
      }
      this.model = this.listing.get('offers').find(__bind(function(offer) {
        var _ref;
        return offer.get('creator')._id === ((_ref = hs.users.User.get()) != null ? _ref._id : void 0);
      }, this));
      if (!(this.model != null)) {
        this.model = new hs.offers.Offer();
        this.model.set({
          listing: this.listing
        });
      }
      this.model.set({
        amount: parseFloat(this.get('amount').replace('$', ''))
      });
      this.model.save();
      this.blur();
      return this.clear();
    },
    disable: function() {
      return this.disabled = true;
    },
    enable: function() {
      return this.disabled = false;
    }
  });
}).call(this);
