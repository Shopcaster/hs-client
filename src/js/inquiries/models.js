//depends: inquiries/main.js,
//         core/models/model.js,
//         core/models/fields.js

hs.inquiries.Inquiry = hs.models.Model.extend({
  key: 'inquiry',
  fields: _.extend({
    question: null,
    answer: null,
    listing: function(){
      return new hs.models.fields.ModelField(hs.listings.models.Listing);
    },
    creator: function(){
      return new hs.models.fields.ModelField(hs.auth.models.User);
    }
  }, hs.models.Model.prototype.fields),
  accept: function(){
    hs.log('TODO: accept offer is a noop');
  }
});

hs.inquiries.InquirySet = hs.models.ModelSet.extend({
  model: hs.inquiries.Inquiry,
});
