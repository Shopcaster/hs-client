//depends: main.js, core/object.js


hs.models = hs.models || new Object();
hs.models.fields = new Object();

// super-field

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
  },
  invalid: function(value, msg){
    var err = '"'+value+'" is an invalid value for "'
        +this.model.key+'.'+this.fieldName+'".';
    if (msg) err += ' '+msg;
    throw(new Error(err));
  }
});

// basic data types

hs.models.fields.FloatField = hs.models.fields.Field.extend({
  set: function(value){
    if (_.isFloat(value))
      return value;
    else
      this.invalid(value, 'Extected a Float.');
  }
});


hs.models.fields.IntegerField = hs.models.fields.Field.extend({
  set: function(value){
    if (_.isInteger(value))
      return value;
    else
      this.invalid(value, 'Extected an Integer.');
  }
});


hs.models.fields.StringField = hs.models.fields.Field.extend({
  set: function(value){
    if (_.isString(value))
      return value;
    else
      this.invalid(value, 'Extected a String.');
  }
});


hs.models.fields.BooleanField = hs.models.fields.Field.extend({
  set: function(value){
    if (_.isBoolean(value))
      return value;
    else
      this.invalid(value, 'Extected a Boolean.');
  }
});

// higher-level fields


hs.models.fields.DateField = hs.models.fields.Field.extend({
  set: function(value){
    if (_.isDate(value))
      return value.getTime() - 1307042003319;
    else
      this.invalid(value, 'Extected a Date.');
  },
  get: function(value){
    return new Date(value + 1307042003319);
  }
});

hs.models.fields.MoneyField = hs.models.fields.FloatField.extend({
  set: function(value){
    if (_.isNumber(value))
      return parseInt(value*100);
    else
      this.invalid(value, 'Extected a Number.');
  },
  get: function(value){
    return value/100;
  }
});

// relationship fields

hs.models.fields.CollectionField = hs.models.fields.Field.extend({
  initialize: function(SetClass, foreignField){
    this.SetClass = SetClass;
    this.setInstance =  new this.SetClass();
    this.foreignField = foreignField;
  },
  setModelInstance: function(){
    hs.models.fields.Field.prototype.setModelInstance.apply(this, arguments);

    if (_.isUndefined(this.foreignField))
      this.foreignField = this.model.key;

    if (this.model._id)
      this.sub();
    else
      this.model.once('change:_id', this.sub, this);

    this.setInstance.bind('change',
        _.bind(this.model.trigger, this.model, 'change:'+this.fieldName));
  },
  set: function(value){
    if (value instanceof this.SetClass){
      value = _.map(value, function(model){
        return model._id;
      });
    }else
      throw(new Error('Collection fields must be set to arrays or collections'));
    value = _.uniq(value);
    return value;
  },
  get: function(value){
    this.setInstance.addNew(value);
    return this.setInstance;
  },
  getDefault: function(){
    return this.setInstance;
  },
  sub: function(){
    hs.pubsub.sub(
      // key
      this.model.key+':'+this.model._id+':'
        +this.setInstance.model.prototype.key+'.'+this.foreignField,
      // pub
      _.bind(function(ids){
        if (ids.add)
          this.setInstance.addIds(ids.add);
        if (ids.remove)
          this.setInstance.removeIds(ids.remove);
      }, this),
      // response
      _.bind(function(ids, err){
        if (err) throw(err);
        this.setInstance.addIds(ids);
      }, this)
    );
  }
});


hs.models.fields.ModelField = hs.models.fields.Field.extend({
  initialize: function(Model){
    this.Model = Model;
  },
  set: function(value){
    if (value instanceof this.Model && !_.isUndefined(value._id))
      return value._id;
    else
      this.invalid(value, 'Extected a Model with an _id.');
  },
  get: function(value){
    return this.Model.get(value);
  }
});

