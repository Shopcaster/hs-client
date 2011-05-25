//depends: inquiries/views/main.js, auth/views.js

hs.inquiries.views.QuestionForm = hs.auth.views.AuthForm.extend({
  template: 'offerForm',
  fields: [{
    'name': 'question',
    'type': 'text',
    'placeholder': 'Make an Offer'
  }].concat(hs.auth.views.AuthForm.prototype.fields),
  events: _.extend({
    //?
  }, hs.auth.views.AuthForm.prototype.events),
  initialize: function(opts){
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
    $('input[name=offer]').bind('mousedown', _.bind(function(e){
      e.preventDefault();
      e.stopPropagation();
      this.focus();
    }, this));
    this.listing = opts.listing;
    this.model = new hs.inquiries.Inquiry({
      listing: this.listing.id
    });
    this.bind('change:question', _.bind(function(question){
      this.model.set({question: question.replace('$', '')});
    }, this));
  },
  render: function(){
    hs.auth.views.AuthForm.prototype.render.apply(this, arguments);
    $('body').click(_.bind(this.blur, this));
    $('#offerForm').click(function(e){e.stopPropagation()});
  },
  focus: function(){
    if (!this.rendered) this.render();
    $('#offerForm').addClass('open').fadeIn(200);
    this.$('[name=question]').focus();
  },
  blur: function(){
    $('#offerForm').fadeOut(200).removeClass('open');
  },
  makeOffer: function(e){
    e.preventDefault();
    e.stopPropagation();
    hs.log('click');
    this.focus();
  },
  validateQuestion: function(value, clbk){
    //?
  },
  submit: function(){
    this.model.set({
      creator: hs.auth.getUser(),
      created: new Date()
    });
    this.model.save();
    this.clear();
    this.model = new hs.Inquiry.Inquiry({
      listing: this.listing.id
    });
    this.blur();
  }
});
