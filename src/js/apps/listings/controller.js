//depends: core/controller.js, apps/listings/models.js

hs.regController('listings', Backbone.Controller.extend({
  routes: {
    '!/listings/new/': 'newListing',
    '!/listings/:id/': 'listing'
  },
  listing: function(id){
    var listing = new hs.listings.models.Listing({id: parseInt(id)}),
      view = new hs.listings.views.ListingPage({
        model: listing,
        el: $('#main')
      });
    view.render();
    listing.fetch();//({success: _.bind(view.render, view)});
  },
  newListing: function(){
    var listingForm = new hs.listings.views.ListingForm({
      el: $('#main')
    });
    listingForm.render();
  }
}));

