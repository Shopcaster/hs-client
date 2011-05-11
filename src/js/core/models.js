//depends: main.js, core/pubsub.js


hs.models = new Object();

hs.models.Model = Backbone.Model.extend({
  key: null,
  url: function(){return this.key},
  initialize: function(){
    _.bindAll(this);
    if (this.get('id'))
      this._sub();
    else
      this.bind('change:id', _.bind(function(){
        this.unbind(arguments.callee);
        this._sub();
      }, this));
  },
  _sub: function(){
    hs.pubsub.sub(this.key+':'+this.get('id'), _.bind(function(fields){
      if (fields.id == this.id) this.set(fields);
    }, this));
  }
});

hs.models.ModelSet = Backbone.Collection.extend({});
