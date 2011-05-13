//depends: main.js, core/pubsub.js, core/models/fields.js


hs.models = hs.models || new Object();

hs.models.Model = Backbone.Model.extend({
  key: null,
  fields: {
    'id': null,
    'created': null,
    'updated': null,
  },
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
    _.each(this.fields, _.bind(function(field, fieldname){
      if (_.isFunction(field))
        this.fields[fieldname] = field = field.call(this);
      if (field instanceof hs.models.fields.Field)
        field.setModelInstance(this);
    }, this));
  },
  _sub: function(){
    hs.pubsub.sub(this.key+':'+this.get('id'), _.bind(function(fields){
      if (fields && fields.id == this.id) this.set(fields);
    }, this));
  },
  set: function(fields){
    _.each(fields, _.bind(function(value, fieldname){
      if (_.isUndefined(this.fields[fieldname]))
        throw(new Error(fieldname+' is not a '+this.key+' field'));
      else if (this.fields[fieldname] instanceof hs.models.fields.Field)
        fields[fieldname] = this.fields[fieldname].set(value);
    }, this));
    arguments[0] = fields;

    return Backbone.Model.prototype.set.apply(this, arguments)
  },
  get: function(fieldname){
    if (_.isUndefined(this.fields[fieldname]))
      throw(new Error(fieldname+' is not a '+this.key+' field'));

    var value = Backbone.Model.prototype.get.call(this, fieldname);

    if (this.fields[fieldname] instanceof hs.models.fields.Field)
      value = this.fields[fieldname].get(value);

    return value;
  }
});

hs.models.ModelSet = Backbone.Collection.extend({});
