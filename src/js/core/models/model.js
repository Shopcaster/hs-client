
dep.require('sync');
dep.require('hs.models.fields.Field');

dep.provide('hs.models.Model');
dep.provide('hs.models.ModelSet');


hs.models = hs.models || new Object();

hs.models.Model = Backbone.Model.extend({
  key: null,

  fields: {
    '_id': new hs.models.fields.StringField(),
    'creator': function(){
      return new hs.models.fields.ModelField(hs.users.User);
    },
    'created': new hs.models.fields.DateField(),
    'modified': new hs.models.fields.DateField(),
    'deleted': new hs.models.fields.BooleanField()
  },

  url: function(){return this.key},

  initialize: function(attrs, opts){
    _.bindAll(this);
    this.loaded = false;

    if (this._id){
      var success = (opts && opts.success) ? opts.success : undefined;
      var error = (opts && opts.error) ? opts.error : undefined;
      this.fetch({success: function(){
        this.loaded = true;
        this.trigger('loaded');
        if (success) success();
      }, error: error, context: this});
    }else{
      this.once('change:_id', function(){
        this.constructor.register(this);
        this.fetch({success: function(){
          this.loaded = true;
          this.trigger('loaded');
          if (success) success();
        }, context: this});
      }, this);
    }

    _.each(this.fields, _.bind(function(field, fieldname){
      if (_.isFunction(field))
        this.fields[fieldname] = field = field.call(this);
      if (field instanceof hs.models.fields.Field){
        field.setModel(this.constructor);
        field.modelInit(this, fieldname);
      }
    }, this));
  },

  set: function(fields, options){
    if (_.isUndefined(options) || options.raw !== true){

      _.each(fields, function(value, fieldname){

        if (_.isUndefined(this.fields[fieldname]))
          throw(new Error(fieldname+' is not a '+this.key+' field'));
        else if (this.fields[fieldname] instanceof hs.models.fields.Field)
          fields[fieldname] = this.fields[fieldname].set(value, this, fieldname);

      }, this);

      _.extend(this.updates = this.updates || {}, fields);
      arguments[0] = fields;
    }

    return Backbone.Model.prototype.set.apply(this, arguments)
  },

  get: function(fieldname){
    if (_.isUndefined(this.fields[fieldname]))
      throw(new Error(fieldname+' is not a '+this.key+' field'));

    var value = Backbone.Model.prototype.get.call(this, fieldname);

    if (this.fields[fieldname] instanceof hs.models.fields.Field)
      if (!_.isUndefined(value))
        value = this.fields[fieldname].get(value, this, fieldname);
      else
        value = this.fields[fieldname].getDefault(this, fieldname);

    return value;
  },

  withField: function(field, clbk, context){
    // use withRel is field is a relationship and it needs to span
    if (/\./.test('field') || this.fields[field] instanceof hs.models.fields.ModelField)
      return this.withRel(field, clbk, context);

    else if (this.fields[field] instanceof hs.models.fields.CollectionField)
      return this.withSet(field, clbk, context);

    if (this.get(field))
      clbk.call(context, this.get(field))
    else
      this.once('change:'+field, function(){
        clbk.call(context, this.get(field));
      }, this);
  },

  withSet: function(field, clbk, context){
    if (!this.loaded)
      return this.once('loaded', _.bind(this.withSet, this, field, clbk, context))
    
    var col = _.clone(this.get(field).toArray());
    var parent = this;
    (function next(){
      var model = col.pop();

      if (_.isUndefined(model))
        return clbk.call(context, parent.get(field))

      if (model.loaded) next();
      else model.once('loaded', next);
    })();
  },

  withRel: function(rel, clbk, context){
    var rels = rel.split('.').reverse();
    var parent = this;
    (function rev(){
      var rel = rels.pop();

      if (_.isUndefined(rel)){
        clbk.call(context, parent);
      }else if (parent.get(rel) && parent.get(rel).loaded){
        parent = parent.get(rel);
        rev();
      }else if (parent.get(rel)){
        parent.get(rel).once('loaded', function(){
          parent = parent.get(rel);
          rev();
        });
      }else{
        parent.once('change:'+rel, function(){
          if (parent.get(rel) && parent.get(rel).loaded){
            parent = parent.get(rel);
            rev();
          }else if (parent.get(rel)){
            parent.get(rel).once('loaded', function(){
              parent = parent.get(rel);
              rev();
            });
          }
        });
      }
    })();
  }
});

hs.models.Model.extend = function(){
  var Model = Backbone.Model.extend.apply(this, arguments);

  Model.instances = {};
  Model.get = function(_id){
    if (_.isUndefined(_id)) throw(new Error('cannot get a model without an _id'));

    if (Model.instances.hasOwnProperty(_id))
      return Model.instances[_id];

    var instance = new Model();
    instance.set({_id: _id}, {raw: true});
    Model.instances[_id] = instance;
    return instance;
  };

  Model.register = function(instance){
    this.instances[instance._id] = instance;
  };

  return Model;
};




hs.models.ModelSet = Backbone.Collection.extend({
  cast: function(ids){
    return _.map(ids, function(id){
      return this.model.get(id);
    }, this);
  },

  diffIds: function(ids){
    this.each(function(model){
      if (!_.include(ids, model._id))
        this._remove(model);
    }, this);

    _.each(ids, function(id){
      var model = this.model.get(id);
      if (!this.include(model))
        this._add(model)
    }, this);
  },

  addIds: function(ids){
    this.add(this.cast(ids));
  },

  removeIds: function(ids){
    this.remove(this.cast(ids));
  },

  addNew: function(ids){
    var newIds = _.select(ids, function(id){
      return _.isUndefined(this.get(id));
    }, this);
    var cast = this.cast(newIds);
    if (cast.length) this.add(cast);
  }
});
