//depends: listings/main.js,
//         core/models/model.js,
//         core/models/fields.js,
//         auth/models.js

hs.listings.models = new Object();

hs.listings.models.Listing = hs.models.Model.extend({
  key: 'listing',
  fields: _.extend({
    photo: null,
    description: null,
    latitude: null,
    longitude: null,
    price: null,
    best_offer: null,
    offers: function(){
      return new hs.models.fields.CollectionField(hs.offers.OfferSet)
    },
  }, hs.models.Model.prototype.fields),
  initialize: function(){
    this.bind('loaded', _.bind(function(){
      var offers = this.get('offers');
      var offersLoaded = _.after(offers.length, _.bind(function(){
        this.trigger('loaded:offers');
      }, this));
      offers.each(function(offer){
        offer.bind('loaded', offersLoaded);
      }, this);
    }, this));
    hs.models.Model.prototype.initialize.apply(this, arguments);
  },
  bestOffer: function(clbk){
    // hs.log('bestOffer');
    var topAmount = 0, topOffer = null;
    var offers = this.get('offers');
    var done = _.after(offers.length, function(){
      // hs.log('returning');
      clbk(topOffer);
    });
    offers.each(function(offer){
      var check = function(){
        if (offer.get('amount') > topAmount){
          topAmount = offer.get('amount');
          topOffer = offer;
        }else{
          // hs.log('not top amount', offer.get('amount'))
        }
        done();
      };
      if (!offer.loaded){
        // hs.log('loading');
        offer.bind('loaded', function(){
          // hs.log('loaded');
          check();
        });
      }else{
        // hs.log('loaded');
        check();
      }
    });
  }
});

hs.listings.models.ListingSet = hs.models.ModelSet.extend({
  model: hs.listings.models.Listing,
});
