
dep.require('hs.inqueries');
dep.require('hs.models.Model');
dep.require('hs.models.fields.Field');

dep.provide('hs.inquiries.Inquiry');
dep.provide('hs.inquiries.InquirySet');

hs.inquiries.Inquiry = hs.models.Model.extend({
  key: 'inquiry',
  fields: _.extend({
    question: null,
    answer: null,
    listing: function(){
      return new hs.models.fields.ModelField(hs.listings.models.Listing);
    }
  }, hs.models.Model.prototype.fields)
});

hs.inquiries.InquirySet = hs.models.ModelSet.extend({
  model: hs.inquiries.Inquiry,
});
