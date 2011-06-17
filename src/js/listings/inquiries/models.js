//depends: listings/inquiries/main.js,
//         core/models/model.js,
//         core/models/fields.js

hs.inquiries.Inquiry = hs.models.Model.extend({
  key: 'inquiry',
  fields: _.extend({
    question: null,
    answer: null,
    creator: function(){
      return new hs.models.fields.ModelField(hs.auth.models.User);
    },
    listing: function(){
      return new hs.models.fields.ModelField(hs.listings.models.Listing);
    }
  }, hs.models.Model.prototype.fields)
});

hs.inquiries.InquirySet = hs.models.ModelSet.extend({
  model: hs.inquiries.Inquiry,
});
