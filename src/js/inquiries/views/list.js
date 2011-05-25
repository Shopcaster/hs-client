//depends: core/views.js,
//         inquiries/views/main.js,
//         inquiries/views/form.js,
//         inquiries/views/inquiry.js

hs.inquiries.views.Inquiry = hs.views.View.extend({
  template: 'inquiries',
  modelEvents: {
    'change:inquiries': 'inquiriesChange'
  },
  render: function(){
    this._tmplContext.inquiries = this.model.get('inquires').toJSON();
    hs.views.View.prototype.render.apply(this, arguments);
    this.questionForm = this.questionForm || new hs.inquiries.views.QuestionForm({
      appendTo: this.$('#questionForm'),
      listing: this.model
    });
    this.renderInquiries();
  },
  inquiryViews: new Object(),
  renderInquiries: function(){
    var newInquiries = this.model.get('inquiries');
    var newInquiryIds = [];
    // add new inquiries
    _.each(newInquiries, _.bind(function(o, i){
      var inquiry = newInquiries.at(i);
      newInquiryIds.push(inquiry.id);
      if (_.isUndefined(this.inquiryViews[inquiry.id])){
        this.inquiryViews[inquiry.id] = new hs.inquiries.views.Inquiry({
          appendTo: $('#inquiryList'),
          model: inquiry
        });
      }
    }, this));
    // remove old inquiries
    _.each(_.keys(this.inquiryViews), _.bind(function(id){
      id = parseInt(id);
      if (!_.include(newInquiryIds, id))
        delete this.inquiryViews[id];
    }, this));
    // render inquiries
    _.each(this.inquiryViews, _.bind(function(view){
      if (!view.rendered) view.render();
    }, this));
  },
  inquiriesChange: function(){
    this.renderInquiries();
  }
});
