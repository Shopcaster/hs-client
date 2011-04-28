//depends: core/auth/dialog.js, apps/listings/main.js, apps/listings/views.js

hs.listings.views.offerDialog = hs.auth.Dialog.extend({
    template: 'listingOfferDialog',
    // events: _.extend(hs.auth.Dialog.prototype.events, {}),
    submit: function(e){
        this.amount = $('input[name=amount]').val();
        this.trigger('set:amount', this.amount);
        hs.auth.Dialog.prototype.events.apply(this, arguments);
    }
});
