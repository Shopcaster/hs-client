//depends: core/controller.js, apps/listings/models.js

hs.regController('listings', Backbone.Controller.extend({
    routes: {
        '/listings/:id/': 'listing'
    },
    listing: function(id){
        hs.log('routed to listing');
        var listing = new hs.listings.models.Listing({id: parseInt(id)}), 
            view = new hs.listings.views.ListingPage({
                model: listing,
                el: $('#main')
            });
        view.render();
        listing.fetch();//({success: _.bind(view.render, view)});
    }
}));

