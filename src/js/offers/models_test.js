//depends: offers/models.js

module('Offer Model');

test('relationship subscribe', function(){
  expect(3);
  stop(1000);

  var l = new hs.listings.models.Listing();
  l.set({
    "description": "MacBook 64GB SSD.",
    "latitude": 43.651702,
    "longitude": -79.373703400006,
    // "photo": hs.views.fields.byType['image_capture'].prototype.fakeImage,
    "price": 1500
  });
  l.save(null, {
    success: function(){
      ok(!_.isUndefined(l._id), 'Listing created succesfully');

      l.once('change:offers', function(){
        equal(l.get('offers').length, 1, 'offers available from listings');

        start();
      });

      var o = new hs.offers.Offer();

      o.set({
        listing: l,
        amount: 29.99
      });

      o.save(null, {
        success: function(){
          ok(!_.isUndefined(o._id), 'offer created succesfully');
        },
        error: function(m, err){
          start();
          throw(new Error(JSON.stringify(err)));
        }
      })

    }, error: function(model, err){
      start();
      throw(new Error(SON.stringify(err)));
    }
  });
});

test('rel sub event issue', function(){
  stop(1000);

  var l = new hs.listings.models.Listing({'description': 'test'});
  l.save(null, {
    success: function(){

      var o = new hs.offers.Offer();
      o.set({listing: l});
      o.save();
      var o2 = new hs.offers.Offer();
      ok(o.fields.messages !== o2.fields.messages, 'offers have different collection fields');
      ok(_.isUndefined(o2.get('listing')), 'o2 listing undefined');

      start();

    }, error: function(model, err){
      start();
      throw(new Error(SON.stringify(err)));
    }
  });
});