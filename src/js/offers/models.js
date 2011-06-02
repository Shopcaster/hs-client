//depends: offers/main.js,
//         core/models/model.js,
//         core/models/fields.js

hs.offers.Offer = hs.models.Model.extend({
  key: 'offer',
  fields: _.extend({
    amount: new hs.models.fields.MoneyField(),
    listing: function(){
      return new hs.models.fields.ModelField(hs.listings.models.Listing);
    },
    messages: function(){
      return new hs.models.fields.CollectionField(hs.messages.MessageSet)
    }
  }, hs.models.Model.prototype.fields),
  accept: function(){
    hs.log('TODO: accept offer is a noop');
  }
});

hs.offers.OfferSet = hs.models.ModelSet.extend({
  model: hs.offers.Offer,
});
