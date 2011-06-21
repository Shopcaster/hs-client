//depends:
// listings/messages/views/main.js,
// core/views/authForm.js

hs.messages.views.Form = hs.auth.views.AuthForm.extend({
  template: 'messageForm',
  fields: [{
    'name': 'message',
    'type': 'text',
    'placeholder': 'Message'
  }].concat(hs.auth.views.AuthForm.prototype.fields),
  initialize: function(opts){
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
    this.convo = opts.convo;
  },
  validateMessage: function(value, clbk){
    clbk(true);
  },
  submit: function(){
    new hs.messages.Message().save({
      convo: this.convo,
      message: this.get('message')
    });
    this.clear();
  }
});
