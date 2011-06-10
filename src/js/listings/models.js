//depends: listings/main.js,
//         core/models/model.js,
//         core/models/fields.js,
//         auth/models.js

hs.listings.models = new Object();

hs.listings.models.Listing = hs.models.Model.extend({
  key: 'listing',
  fields: _.extend({
    sold: new hs.models.fields.BooleanField(),
    photo: new hs.models.fields.StringField(),
    description: new hs.models.fields.StringField(),
    latitude: new hs.models.fields.FloatField(),
    longitude: new hs.models.fields.FloatField(),
    price: new hs.models.fields.MoneyField(),
    offers: function(){
      return new hs.models.fields.CollectionField(hs.offers.OfferSet)
    },
    inquiries: function(){
      return new hs.models.fields.CollectionField(hs.inquiries.InquirySet)
    },
  }, hs.models.Model.prototype.fields),
  bestOffer: function(clbk){
    var topAmount = 0, topOffer = null;
    var offers = this.get('offers');
    var done = _.after(offers.length, function(){
      // hs.log('returning');
      clbk(topOffer);
    });
    offers.each(function(offer){
      if (parseInt(offer.get('amount')) > topAmount){
        topAmount = offer.get('amount');
        topOffer = offer;
      }
      done();
    });
  },
  sync: function(method, model, success, error){
    if (method != 'create')
      return Backbone.sync.apply(this, arguments);

    var url = conf.server.protocol+'://'+conf.server.host+':'+conf.server.port
          +'/iapi/listings/';

    var data = this.toJSON();
    data.password = hs.auth.pass;
    data.email = hs.auth.email;
    $.post(url, data, function(resp, status){
      if (status == 200)
        success();
      else
        error();
    });
  }
});

hs.listings.models.ListingSet = hs.models.ModelSet.extend({
  model: hs.listings.models.Listing,
});
