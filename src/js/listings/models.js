//depends: listings/main.js,
//         core/models/model.js,
//         core/models/fields.js,
//         auth/models.js

hs.listings.models = new Object();

hs.listings.models.Listing = hs.models.Model.extend({
  key: 'listing',
  fields: _.extend({
    photo: null,
    description: null,
    latitude: null,
    longitude: null,
    price: null,
    offers: function(){
      return new hs.models.fields.CollectionField(hs.offers.OfferSet)
    },
  }, hs.models.Model.prototype.fields),
  bestOffer: function(){
    var top = [0, null];
    _.each(this.get('offers'), function(offer){
      if (offer.get('amount') > top[0])
        top = [offer.get('amount'), offer];
    });
    return top[1];
  }
});

hs.listings.models.ListingSet = hs.models.ModelSet.extend({
  model: hs.listings.models.Listing,
});
