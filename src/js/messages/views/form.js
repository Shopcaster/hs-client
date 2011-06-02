//depends: messages/views/main.js, auth/views.js

hs.messages.views.Form = hs.auth.views.AuthForm.extend({
  template: 'messageForm',
  focusFieldName: 'message',
  fields: [{
    'name': 'message',
    'type': 'text'
  }].concat(hs.auth.views.AuthForm.prototype.fields),
  initialize: function(opts){
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
    this.offer = opts.offer;
    this.newModel();
  },
  newModel: function(){
    this.model = new hs.messages.Message({
      offer: this.offer._id
    });
  },
  validateMessage: function(value, clbk){
    clbk(/^\d+$/.test(value));
  },
  submit: function(){
    this.model.set({
      creator: hs.auth.getUser(),
      created: new Date(),
      message: this.get('message')
    });
    this.model.save();
    this.clear();
    this.newModel();
    this.blur();
  }
});
