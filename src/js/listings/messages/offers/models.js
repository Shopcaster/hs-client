
dep.require('hs.offers');
dep.require('hs.models.Model');
dep.require('hs.listings.Listing');
dep.require('hs.messages.MessageSet');

dep.provide('hs.offers.Offer');
dep.provide('hs.offers.OfferSet');

hs.offers.Offer = hs.models.Model.extend({
  key: 'offer',
  fields: _.extend({
    amount: new hs.models.fields.MoneyField(),
    listing: function(){
      return new hs.models.fields.ModelField(hs.listings.Listing);
    }
    // messages: function(){
    //   return new hs.models.fields.CollectionField(hs.messages.MessageSet)
    // }
  }, hs.models.Model.prototype.fields),
  accept: function(clbk, context){
    this.withField('listing', function(listing){
      listing.save({accepted: this}, {success: clbk, error: clbk, context: context});
    }, this);
  },
  unaccept: function(clbk, context){
    this.withField('listing', function(listing){
      listing.save({accepted: null}, {success: clbk, error: clbk, context: context});
    }, this);
  }
});

hs.offers.OfferSet = hs.models.ModelSet.extend({
  model: hs.offers.Offer,
});
