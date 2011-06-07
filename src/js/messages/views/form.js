//depends: messages/views/main.js, auth/views.js

hs.messages.views.Form = hs.views.Form.extend({
  template: 'messageForm',
  fields: [{
    'name': 'message',
    'type': 'text'
  }].concat(hs.views.Form.prototype.fields),
  initialize: function(opts){
    hs.views.Form.prototype.initialize.apply(this, arguments);
    this.offer = opts.offer;
    this.newModel();
  },
  newModel: function(){
    this.model = new hs.messages.Message();
  },
  validateMessage: function(value, clbk){
    clbk(true);
  },
  submit: function(){
    this.model.set({
      offer: this.offer,
      message: this.get('message')
    });
    this.model.save();
    this.clear();
    this.newModel();
  }
});
