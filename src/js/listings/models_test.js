//depends: listings/models.js

module('Listing Model');

test('create', function(){
  expect(1);
  stop(1000);

  var l = new hs.listings.models.Listing();
  l.set({
    "description": "MacBook 64GB SSD.",
    "latitude": 43.651702,
    "longitude": -79.373703400006,
    "photo": hs.views.fields.byType['image_capture'].prototype.fakeImage,
    "price": 1500
  });
  l.save(null, {success: function(){
    ok(!_.isUndefined(l._id), 'Listing created succesfully');
    start();
  }});
});

test('update', function(){
  expect(2);
  stop(1000);

  var l = new hs.listings.models.Listing();
  l.set({
    "description": "MacBook Pro Must see. ",
    "latitude": 43.651702,
    "longitude": -79.373730006,
    "photo": hs.views.fields.byType['image_capture'].prototype.fakeImage,
    "price": 1500
  });

  l.save(null, {success: function(){
    ok(!_.isUndefined(l._id), 'Listing created succesfully');

    l.set({description: 'this is my new description'});
    l.save(null, {success: function(){
      equal(l.get('description'), 'this is my new description', 'description set');
    }});

  }});
});

test('read', function(){
  expect(2);
  stop(1000);

  // create without involving the model layer
  hs.con.send('create', {
    type: 'listing',
    data: {
      "description": "MacBook Pro Must see. ",
      "latitude": 43.6533,
      "longitude": -79.373730006,
      "photo": hs.views.fields.byType['image_capture'].prototype.fakeImage,
      "price": 150000
    }
  }, function(_id){
    ok(_.isString(_id), 'id returned from create');

    var l = new hs.listings.models.Listing({_id: _id}, {success: function(){
      equal(l.get('latitude'), 43.6533, 'lat data succesfully fetched');
      start();
    }});

  });
});
