
dep.require('hs.listings');
dep.require('hs.models.Model');
dep.require('hs.users.User');

dep.provide('hs.listings.Listing');
dep.provide('hs.listings.ListingSet');


hs.listings.Listing = hs.models.Model.extend({
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
    convos: function(){
      return new hs.models.fields.CollectionField(hs.messages.ConvoSet)
    },
    inquiries: function(){
      return new hs.models.fields.CollectionField(hs.inquiries.InquirySet)
    },
    accepted: function(){
      return new hs.models.fields.ModelField(hs.offers.Offer, {nullable: true});
    },
  }, hs.models.Model.prototype.fields),

  bestOffer: function(clbk, context){
    var topAmount = 0, topOffer = null;
    var offers = this.get('offers');
    var done = _.after(offers.length, function(){
      // hs.log('returning');
      clbk.call(context, topOffer);
    });
    offers.each(function(offer){
      if (parseInt(offer.get('amount')) > topAmount){
        topAmount = offer.get('amount');
        topOffer = offer;
      }
      done();
    });
  },

  getConvoForUser: function(user, clbk, context){
    if (!(user instanceof hs.users.User)){
      context = clbk;
      clbk = user;
      user = hs.users.User.get();
    }
    if (!(user)) return clbk.call(context);

    this.withField('convos', function(){
      var retConvo;
      var convos = this.get('convos');

      if (convos.length == 0)
        return clbk.call(context);

      var done = _.after(convos.length, function(){
        clbk.call(context, retConvo);
      });
      convos.each(function(convo){
        convo.withField('creator', function(creator){
          if (user._id == creator._id)
            retConvo = convo;
          done();
        });
      });
    }, this);
  },

  sync: function(method, model, success, error){
    if (method != 'create')
      return Backbone.sync.apply(this, arguments);

    var url = conf.server.protocol+'://'+conf.server.host+':'+conf.server.port
          +'/iapi/listings';

    var data = model.toJSON();
    data.password = hs.auth.pass;
    data.email = hs.auth.email;
    hs.loading();
    $.post(url, data, function(resp, status){
      hs.loaded();
      if (status == 'success') {
        model.unset('photo');
        model.set({_id: resp}, {raw: true});
        success();
      } else {
        error();
      }
    });
  }

});

hs.listings.ListingSet = hs.models.ModelSet.extend({
  model: hs.listings.Listing,
});
