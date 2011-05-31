//depends: messages/main.js,
//         core/models/model.js,
//         core/models/fields.js

hs.messages.Message = hs.models.Model.extend({
  key: 'message',
  fields: _.extend({
    message: new hs.models.fields.StringField(),
    offer: function(){
      return new hs.models.fields.ModelField(hs.offers.Offer);
    },
    creator: function(){
      return new hs.models.fields.ModelField(hs.auth.models.User);
    }
  }, hs.models.Model.prototype.fields)
});

hs.messages.MessageSet = hs.models.ModelSet.extend({
  model: hs.messages.Message,
});
