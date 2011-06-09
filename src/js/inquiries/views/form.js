//depends: inquiries/views/main.js, core/views/mixins/dialog.js

hs.inquiries.views.QuestionForm = hs.auth.views.AuthForm.mixin(hs.views.mixins.Dialog).extend({
  template: 'questionForm',
  focusSelector: 'input[name=question]',
  fields: [{
    'name': 'question',
    'type': 'text',
    'placeholder': 'Ask a Question'
  }].concat(hs.auth.views.AuthForm.prototype.fields),
  events: _.extend({
    //?
  }, hs.auth.views.AuthForm.prototype.events),
  initialize: function(opts){
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
    this.listing = opts.listing;
    this.model = new hs.inquiries.Inquiry();
  },
  focus: function(){
    hs.views.mixins.Dialog.focus.apply(this, arguments);
    this.$('[name=question]').focus();
  },
  submit: function(){
    this.model.set({
      question: this.get('question'),
      listing: this.listing
    });
    this.model.save();
    this.clear();
    this.model = new hs.inquiries.Inquiry();
    this.blur();
  }
});

hs.inquiries.views.AnswerForm = hs.auth.views.AuthForm.extend({
  template: 'answerForm',
  fields: [{
    'name': 'answer',
    'type': 'text',
    'placeholder': 'Answer the question'
  }].concat(hs.auth.views.AuthForm.prototype.fields),
  events: _.extend({
  }, hs.auth.views.AuthForm.prototype.events),
    //?
  initialize: function(opts){
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
    this.listing = opts.listing;
    this.model = new hs.inquiries.Inquiry();
  },
  submit: function(){
    this.model.set({
      question: this.get('answer'),
      listing: this.listing
    });
    this.model.save();
  }
});
