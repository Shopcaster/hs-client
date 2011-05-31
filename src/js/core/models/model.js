//depends: main.js, core/data/sync.js, core/models/fields.js


hs.models = hs.models || new Object();

hs.models.Model = Backbone.Model.extend({
  key: null,
  fields: {
    '_id': new hs.models.fields.StringField(),
    'creator': function(){
      return new hs.models.fields.ModelField(hs.auth.models.User);
    },
    'created': new hs.models.fields.DateField(),
    'modified': new hs.models.fields.DateField(),
    'deleted': new hs.models.fields.BooleanField()
  },
  loaded: false,
  url: function(){return this.key},
  initialize: function(){
    _.bindAll(this);
    if (this._id)
      this.fetch();
    else{
      var bound;
      this.bind('change:_id', bound = _.bind(function(){
        this.unbind(bound);
        this.constructor.register(this);
        this.fetch();
      }, this));
    }
    _.each(this.fields, _.bind(function(field, fieldname){
      if (_.isFunction(field))
        this.fields[fieldname] = field = field.call(this);
      if (field instanceof hs.models.fields.Field)
        field.setModelInstance(this, fieldname);
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
        value = this.fields[fieldname].getDefault();

    return value;
  }
});

hs.models.Model.extend = function(){
  var Model = Backbone.Model.extend.apply(this, arguments);

  Model.instances = {};
  Model.get = function(_id, opts){
    if (_.isUndefined(_id)) throw(new Error('cannot get a model without an _id'));

    if (Model.instances.hasOwnProperty(_id))
      return Model.instances[_id];

    var instance = new Model(_.extend(opts || {}, {_id: _id}));
    Model.instances[_id] = instance;
    return instance;
  };

  Model.register = function(instance){
    this.instances[instance._id] = instance;
  };

  return Model;
};

hs.models.ModelSet = Backbone.Collection.extend({
  addNew: function(ids){
    var newIds = _.select(ids, function(id){
      return _.isUndefined(this.get(id));
    }, this);
    var cast = _.map(newIds, function(id){
      return new this.model({_id: id});
    }, this);
    if (cast.length) this.add(cast);
  },
  add: function(models){
    var bind = _.bind(function(model){
      model.bind('change', _.bind(this.trigger, this, 'change'));
    }, this);
    if (_.isArray(models))
      _.each(models, bind);
    else
      bind(models);
    return Backbone.Collection.prototype.add.apply(this, arguments);
  }
});
