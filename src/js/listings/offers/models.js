//depends: listings/offers/main.js,
//         core/models/model.js,
//         core/models/fields.js

hs.offers.Offer = hs.models.Model.extend({
  key: 'offer',
  fields: _.extend({
    amount: new hs.models.fields.MoneyField(),
    listing: function(){
      return new hs.models.fields.ModelField(hs.listings.models.Listing);
    },
    messages: function(){
      return new hs.models.fields.CollectionField(hs.messages.MessageSet)
    }
  }, hs.models.Model.prototype.fields),
  accept: function(clbk, context){
    this.withField('listing', function(listing){
      listing.save({accepted: this}, {success: clbk, error: clbk, context: context});
    }, this);
  },
  unaccept: function(clbk, context){
    this.withField('listing', function(listing){
      // listing.save({accepted: null}, {success: clbk, error: clbk, context: context});
    }, this);
  }
});

hs.offers.OfferSet = hs.models.ModelSet.extend({
  model: hs.offers.Offer,
});
