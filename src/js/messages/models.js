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
  }, hs.models.Model.prototype.fields),
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

hs.messages.MessageSet = hs.models.ModelSet.extend({
  model: hs.messages.Message,
  comparator: function(message){
    if (message.get('created'))
      return message.get('created').getTime();
    else
      return 1;
  }
});
