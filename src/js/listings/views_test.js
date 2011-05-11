//depends: listings/views.js, listings/models.js

module("Listing views");

test("test view reaction to data change", function() {
  var listing = new hs.listings.models.Listing(),
      view = new hs.listings.views.ListingPage({
    model: listing,
    el: $('#main')
  });
  view.render();

  var c = new Date();
  c.setYear(2010);
  listing.set({
    description: 'Test Desc',
    created_on: c,
    latitude: 43.651702,
    longitude: -79.373703,
    price: 100
  });

  ok($('.asking .listing-obi-value').text() == '$100', 'price set');
  ok($('#listing-description').text() == listing.get('description'), 'desc set');

  listing.set({'price': 150});

  ok($('.asking .listing-obi-value').text() == '$150', 'price UI reacted to model change');
});
