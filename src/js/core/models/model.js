//depends: main.js, core/pubsub.js, core/models/fields.js


hs.models = hs.models || new Object();

hs.models.Model = Backbone.Model.extend({
  key: null,
  fields: {
    'id': null,
    'created': null,
    'updated': null,
    'deleted': null,
  },
  loaded: false,
  url: function(){return this.key},
  initialize: function(){
    _.bindAll(this);
    if (this.get('id'))
      this._sub();
    else
      this.bind('change:id', _.bind(function(){
        this.unbind(arguments.callee);
        this.constructor.register(this);
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
    var loaded = _.once(_.bind(function(){
      this.loaded = true;
      this.trigger('loaded');
    }, this));
    hs.pubsub.sub(this.key+':'+this.get('id'), _.bind(function(fields){
      if (fields) this.set(fields);
      loaded();
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
      if (!_.isUndefined(value))
        value = this.fields[fieldname].get(value);
      else
        value = this.fields[fieldname].default();

    return value;
  },
  delete: function(){
    this.set({deleted: true});
    this.save();
  }
});

hs.models.Model.extend = function(){
  var Model = Backbone.Model.extend.apply(this, arguments);

  Model.instances = {};
  Model.get = function(id, opts){
    if (_.isString(id)) id = parseInt(id);
    if (!_.isNumber(id)) opts = id, id = undefined;

    if (Model.instances.hasOwnProperty(id))
      return Model.instances[id];

    var instance = new Model(_.extend(opts || {}, {id: id}));
    Model.instances[id] = instance;
    return instance;
  };

  Model.register = function(instance){
    this.instances[instance.get('id')] = instance;
  };

  return Model;
};

hs.models.ModelSet = Backbone.Collection.extend({});
