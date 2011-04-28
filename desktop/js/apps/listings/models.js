//depends: apps/listings/main.js, core/models.js

hs.listings.models = new Object();

hs.listings.models.Listing = hs.models.Model.extend({
    auth: _.extend(hs.models.Model.prototype.auth, {
        'GET': false
    }),
    url: function(){
        return hs.API_URL+'listing/'+this.id+'/';
    }
});


hs.listings.models.ListingSet = hs.models.ModelSet.extend({
    model: hs.listings.models.Listing,
    url: hs.API_URL+'listing/'
});

hs.listings.models.Offer = hs.models.Model.extend({
    url: function(){
        return hs.API_URL+'offer/'+this.id+'/';
    }
});
