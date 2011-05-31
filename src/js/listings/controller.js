//depends: core/controller.js, listings/models.js

hs.regController('listings', hs.Controller.extend({
  routes: {
    '!/listings/new/': 'newListing',
    '!/listing/fake/': 'fake',
    '!/listings/thanks/': 'thanks',
    '!/listings/:id/': 'listing',
    '': 'listings'
  },
  listings: function(){
    hs.page.finish();
    hs.page = new hs.listings.views.List();
    hs.page.render();
  },
  listing: function(id){
    hs.page.finish();
    var listing = hs.listings.models.Listing.get(id);
    hs.page = new hs.listings.views.ListingPage({model: listing});
    hs.page.render();
  },
  fake: function(){
    var l = new hs.listings.models.Listing();
    l.set({
      "description": "MacBook Pro for sale. Excellent condition and fully loaded. 8GB RAM 64GB SSD. Must see. ",
      "latitude": 43.651702,
      "longitude": -79.373703000000006,
      "photo": hs.views.fields.byType['image_capture'].prototype.fakeImage,
      "price": 1500
    });
    l.bind('change:_id', function(){
      hs.goTo('!/listings/'+l._id+'/');
    });
    l.save();
  },
  newListing: function(){
    hs.page.finish();
    hs.page = new hs.listings.views.ListingForm({el: $('#main')});
    hs.page.render();
  },
  thanks: function(){
    hs.page.finish();
    hs.page = new hs.listings.views.Thanks();
    hs.page.render();
    hs.log('mainhtml: '+$('#main').html());
  }
}));
