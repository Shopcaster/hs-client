//depends: apps/listings/main.js, core/models.js

hs.listings.models = new Object();

hs.listings.models.Listing = hs.models.Model.extend({
  key: 'listing'
});


hs.listings.models.ListingSet = hs.models.ModelSet.extend({
  model: hs.listings.models.Listing,
  url: hs.API_URL+'listing/'
});

hs.listings.models.Offer = hs.models.Model.extend({
  key: 'offer',
});
