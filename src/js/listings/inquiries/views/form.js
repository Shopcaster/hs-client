//depends: listings/inquiries/views/main.js, core/views/mixins/dialog.js, auth/views.js

hs.inquiries.views.QuestionForm = hs.auth.views.AuthForm.mixin(hs.views.mixins.Dialog).extend({
  template: 'questionForm',
  focusSelector: 'input[name=question]',
  fields: [{
    'name': 'question',
    'type': 'text',
    'placeholder': 'Ask a Question'
  }].concat(hs.auth.views.AuthForm.prototype.fields),
  initialize: function(opts){
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
    this.listing = opts.listing;
    this.model = new hs.inquiries.Inquiry();
  },
  focus: function(){
    if (this.disabled) return;
    hs.views.mixins.Dialog.focus.apply(this, arguments);
    this.$('[name=question]').focus();
  },
  submit: function(){
    if (this.disabled) return;
    this.model.set({
      question: this.get('question'),
      listing: this.listing
    });
    this.model.save();
    this.clear();
    this.model = new hs.inquiries.Inquiry();
    this.blur();
  },
  disable: function(){
    this.disabled = true;
  },
  enable: function(){
    this.disabled = false;
  }
});

hs.inquiries.views.AnswerForm = hs.views.Form.mixin(hs.views.mixins.Dialog).extend({
  template: 'answerForm',
  fields: [{
    'name': 'answer',
    'type': 'text',
    'placeholder': 'Post an Answer'
  }].concat(hs.views.Form.prototype.fields),
  submit: function(){
    this.model.save({
      answer: this.get('answer')
    });
    this.clear();
    this.blur();
  },
  focus: function(){
    hs.views.mixins.Dialog.focus.apply(this, arguments);
    $('#inquiry-'+this.model._id).addClass('selected');
  },
  blur: function(){
    hs.views.mixins.Dialog.blur.apply(this, arguments);
    $('#inquiry-'+this.model._id).removeClass('selected');
  }
});
