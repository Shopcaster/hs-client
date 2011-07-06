
dep.require('hs.auth.views.AuthForm');
dep.require('hs.messages.views');
dep.require('hs.messages.Message');

dep.provide('hs.messages.views.Form');

hs.messages.views.Form = hs.auth.views.AuthForm.extend({
  template: 'messageForm',
  
  fields: [{
    'name': 'question',
    'type': 'text',
    'placeholder': 'Question',
    'hide': true
  },{
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

  answerPublicly: function(message){
    this.set('question', message.get('message'));
    this.$('#question').show();
    this.pub = true;
    this.pubMessage = message;
  },

  submit: function(){
    if (this.convo._id){
      new hs.messages.Message().save({
        convo: this.convo,
        message: this.get('message')
      });

      if (this.pub){
        new hs.inquiries.Inquiry().save({
          listing: this.convo.get('listing'),
          question: this.get('question'),
          answer: this.get('message')
          //creator: this.pubMessage.get('creator')
        });
        this.pub = false;
        this.$('#question').hide();
      }

      this.clear();

    }else{
      this.convo.save(null, {success: this.submit, context:this});
    }
  }
});
