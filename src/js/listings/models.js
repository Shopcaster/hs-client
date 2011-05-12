//depends: listings/main.js, core/models.js

hs.listings.models = new Object();

hs.listings.models.Listing = hs.models.Model.extend({
  key: 'listing',
  fields: { //for the moment, this is just a referance
    photo: '',
    description: '',
    created: '',
    updated: '',
    latitude: '',
    longitude: '',
    price: '',
    best_offer: '',
    offers: [],
  },
  defaults: {
    best_offer: {amount: 100}
  }
});


hs.listings.models.ListingSet = hs.models.ModelSet.extend({
  model: hs.listings.models.Listing,
  url: hs.API_URL+'listing/'
});

hs.listings.models.Offer = hs.models.Model.extend({
  key: 'offer',
});
