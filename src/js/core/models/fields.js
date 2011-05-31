//depends: main.js, core/object.js


hs.models = hs.models || new Object();
hs.models.fields = new Object();

hs.models.fields.Field = hs.Object.extend({
  set: function(value){
    return value;
  },
  get: function(value){
    return value;
  },
  getDefault: function(){},
  setModelInstance: function(model, fieldName){
    this.model = model;
    this.fieldName = fieldName;
  }
});

hs.models.fields.CollectionField = hs.models.fields.Field.extend({
  initialize: function(SetClass){
    this.SetClass = SetClass;
    this.setInstance =  new this.SetClass();
  },
  setModelInstance: function(){
    hs.models.fields.Field.prototype.setModelInstance.apply(this, arguments);
    this.setInstance.bind('change',
        _.bind(this.model.trigger, this.model, 'change:'+this.fieldName));
  },
  set: function(value){
    if (value instanceof this.SetClass){
      value = _.map(value, function(model){
        return model._id;
      });
    }else if (!_.isArray(value))
      throw(new Error('Collection fields must be set to arrays or collections'));
    value = _.uniq(value);
    return value;
  },
  get: function(value){
    this.setInstance.addNew(value);
    return this.setInstance;
  },
  getDefault: function(){
    return new this.SetClass();
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
      return value._id;
    else
      throw(new Error('invalid model: '+value));
  },
  get: function(value){
    return this.Model.get(value);
  }
});


hs.models.fields.MoneyField = hs.models.fields.Field.extend({
  set: function(value){
    if (_.isNumber(value))
      return parseInt(value*100);
    else
      throw(new Error('invalid value for money field: '+value));
  },
  get: function(value){
    return value/100;
  }
});

