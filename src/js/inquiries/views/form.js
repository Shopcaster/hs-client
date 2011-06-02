//depends: inquiries/views/main.js, core/views/forms/dialog.js

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
    this.model = new hs.inquiries.Inquiry({
      listing: this.listing._id
    });
  },
  focus: function(){
    hs.views.mixins.Dialog.focus.apply(this, arguments);
    this.$('[name=question]').focus();
  },
  submit: function(){
    this.model.set({
      creator: hs.auth.getUser(),
      created: new Date(),
      question: this.get('question')
    });
    this.model.save();
    this.clear();
    this.model = new hs.inquiries.Inquiry({
      listing: this.listing._id
    });
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
    this.model = new hs.inquiries.Inquiry({
      listing: this.listing.id
    });
  },
  submit: function(){
    this.model.set({
      question: this.get('answer')
    });
    this.model.save();
  }
});
