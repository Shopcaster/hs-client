//depends: main.js


hs.models = new Object();

hs.models.Model = Backbone.Model.extend({
  auth: {
    'GET': true,
    'POST': true,
    'PUT': true,
    'DELETE': true
  }
});

hs.models.ModelSet = Backbone.Collection.extend({});
