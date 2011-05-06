//depends: main.js, core/api.js


hs.models = new Object();

hs.models.Model = Backbone.Model.extend({
  initialize: function(){
    hs.api.con.sub(this.url(), _.bind(this.set, this));
  }
});

hs.models.ModelSet = Backbone.Collection.extend({});
