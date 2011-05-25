//depends: inquiries/views/main.js, auth/views.js
hs.inquiries.views.QuestionForm = hs.auth.views.AuthForm.extend({
  template: 'questionForm',
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
    $('input[name=question]').bind('mousedown', _.bind(function(e){
      e.preventDefault();
      e.stopPropagation();
      this.focus();
    }, this));
    this.listing = opts.listing;
    this.model = new hs.inquiries.Inquiry({
      listing: this.listing.id
    });
    this.bind('change:question', _.bind(function(question){
      this.model.set({question: question});
    }, this));
  },
  render: function(){
    hs.auth.views.AuthForm.prototype.render.apply(this, arguments);
    $('body').click(_.bind(this.blur, this));
    $('#questionForm').click(function(e){e.stopPropagation()});
  },
  focus: function(){
    if (!this.rendered) this.render();
    $('#questionForm').addClass('open').fadeIn(200);
    this.$('[name=question]').focus();
  },
  blur: function(){
    $('#questionForm').fadeOut(200).removeClass('open');
  },
  //validateQuestion: function(value, clbk){
  //  //?
  //},
  submit: function(){
    this.model.set({
      creator: hs.auth.getUser(),
      created: new Date()
    });
    this.model.save();
    this.clear();
    this.model = new hs.inquiries.Inquiry({
      listing: this.listing.id
    });
    this.blur();
  }
});
