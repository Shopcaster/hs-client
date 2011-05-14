//depends: main.js


hs.models = hs.models || new Object();
hs.models.fields = new Object();

hs.models.fields.Field = hs.Object.extend({
  set: function(value){
    return value;
  },
  get: function(value){
    return value;
  },
  setModelInstance: function(model){
    this.model = model;
  }
});

hs.models.fields.CollectionField = hs.models.fields.Field.extend({
  initialize: function(SetClass){
    this.SetClass = SetClass;
  },
  set: function(value){
    if (value instanceof this.SetClass){
      value = _.map(value, function(model){
        return model.id;
      });
    }else if (!_.isArray(value))
      throw(new Error('Collection fields must be set to arrays or collections'));
    value = _.uniq(value);
    return value;
  },
  get: function(value){
    return new this.SetClass(_.map(value, _.bind(function(id){
      return new this.SetClass.prototype.model({id: id});
    }, this)));
  }
});


hs.models.fields.ModelField = hs.models.fields.Field.extend({
  initialize: function(Model){
    this.Model = Model;
  },
  set: function(value){
    if (_.isNumber(value))
      return value;
    else if (value instanceof this.Model)
      return value.id;
    else
      throw(new Error('invalid model: '+value));
  },
  get: function(value){
    return new this.Model({id: value});
  },
});

