//depends: main.js, core/pubsub.js


hs.models = new Object();

hs.models.Model = Backbone.Model.extend({
  key: null,
  url: function(){return this.key},
  initialize: function(){
    hs.pubsub.sub(this.key, _.bind(function(fields){
      if (fields.id == this.id) this.set(fields);
    }, this));
  }
});

hs.models.ModelSet = Backbone.Collection.extend({});
