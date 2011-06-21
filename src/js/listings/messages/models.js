//depends: listings/messages/main.js,
//         core/models/model.js,
//         core/models/fields.js

hs.messages.Conversation = hs.models.Model.extend({
  key: 'convo',
  fields: _.extend({
    listing: function(){
      return new hs.models.fields.ModelField(hs.listings.models.Listing);
    },
    messages: function(){
      return new hs.models.fields.CollectionField(hs.messages.MessageSet);
    }
  }, hs.models.Model.prototype.fields)
});

hs.messages.ConvoSet = hs.models.ModelSet.extend({
  model: hs.messages.Conversation
});

hs.messages.Message = hs.models.Model.extend({
  key: 'message',
  fields: _.extend({
    message: new hs.models.fields.StringField(),
    convo: function(){
      return new hs.models.fields.ModelField(hs.messages.Conversation);
    }
  }, hs.models.Model.prototype.fields)
});

hs.messages.MessageSet = hs.models.ModelSet.extend({
  model: hs.messages.Message,
  comparator: function(message){
    if (message.get('created'))
      return message.get('created').getTime();
    else
      return 1;
  }
});
