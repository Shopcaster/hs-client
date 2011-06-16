//depends: main.js, core/object.js


hs.models = hs.models || new Object();
hs.models.fields = new Object();

// super-field

hs.models.fields.Field = hs.Object.extend({
  set: function(value, model, fieldname){
    return value;
  },
  getDefault: function(model, fieldname){},
  get: function(value, model, fieldname){
    return value;
  },
  setModel: function(Model){
    this.Model = Model;
  },
  modelInit: function(model, fieldname){},
  invalid: function(value, msg, fieldname){
    var err = '"'+value+'" is an invalid value for "'
        +this.Model.prototype.key+fieldname?'.'+fieldname:''+'".';
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
    this.foreignField = foreignField;
  },
  modelInit: function(model, fieldname){
    hs.models.fields.Field.prototype.modelInit.apply(this, arguments);

    if (model._id)
      this.sub(model, fieldname);
    else
      model.once('change:_id', _.bind(this.sub, this, model, fieldname));

    if (_.isUndefined(this.foreignField))
      this.foreignField = model.key;

    model.sets = model.sets || {};
    model.sets[fieldname] = new this.SetClass();

    model.sets[fieldname].bind('change',
        _.bind(model.trigger, model, 'change:'+fieldname));

  },
  set: function(value, model, fieldname){
    if (value instanceof this.SetClass){
      value = _.map(value, function(model){
        return model._id;
      });
    }else
      throw(new Error('Collection fields must be set to arrays or collections'));
    value = _.uniq(value);
    return value;
  },
  get: function(value, model, fieldname){
    model.sets[fieldname].addNew(value);
    return model.sets[fieldname];
  },
  getDefault: function(model, fieldname){
    return model.sets[fieldname];
  },
  sub: function(model, fieldname){
    if (_.isUndefined(model._id))
      throw(new Error('cannot subscribe to relationship without _id'));
    hs.pubsub.sub(
      // key
      model.key+':'+model._id+':'
        +model.sets[fieldname].model.prototype.key+'.'+this.foreignField,
      // pub
      function(ids){
        if (_.isArray(ids)){
          model.sets[fieldname].diffIds(ids);
        }else{
          if (ids.add)
            model.sets[fieldname].addIds(ids.add);
          if (ids.remove)
            model.sets[fieldname].removeIds(ids.remove);
        }
      },
      // response
      function(ids, err){
        if (err) throw(err);
        model.sets[fieldname].addIds(ids);
      }, this
    );
  }
});


hs.models.fields.ModelField = hs.models.fields.Field.extend({
  initialize: function(ForeignModel){
    this.ForeignModel = ForeignModel;
  },
  set: function(value){
    if (value instanceof this.ForeignModel && !_.isUndefined(value._id))
      return value._id;
    else
      this.invalid(value, 'Extected a Model with an _id.');
  },
  get: function(value){
    return this.ForeignModel.get(value);
  }
});

