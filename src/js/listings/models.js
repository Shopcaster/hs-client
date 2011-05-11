//depends: listings/main.js, core/models.js

hs.listings.models = new Object();

hs.listings.models.Listing = hs.models.Model.extend({
  key: 'listing',
  fields: {
    photo: '',
    description: '',
    created: '',
    updated: '',
    latitude: '',
    longitude: '',
    price: '',
    best_offer: '',
    offers: [],
  }
});


hs.listings.models.ListingSet = hs.models.ModelSet.extend({
  model: hs.listings.models.Listing,
  url: hs.API_URL+'listing/'
});

hs.listings.models.Offer = hs.models.Model.extend({
  key: 'offer',
});
