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
    best_offer: null,
    offers: function(){
      return new hs.models.fields.CollectionField(hs.listings.models.OfferSet)
    },
  }, hs.models.Model.prototype.fields),
  defaults: {
    best_offer: {amount: 100}
  }
});

hs.listings.models.ListingSet = hs.models.ModelSet.extend({
  model: hs.listings.models.Listing,
});



hs.listings.models.Offer = hs.models.Model.extend({
  key: 'offer',
  fields: _.extend({
    amount: null,
    listing: function(){
      return new hs.models.fields.ModelField(hs.listings.models.Listing);
    },
    creator: function(){
      return new hs.models.fields.ModelField(hs.auth.models.User);
    }
  }, hs.models.Model.prototype.fields),
});

hs.listings.models.OfferSet = hs.models.ModelSet.extend({
  model: hs.listings.models.Offer,
});
