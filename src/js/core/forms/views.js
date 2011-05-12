//depends: core/views.js

hs.views.Form = hs.views.View.extend(_.extend({
  events: _.extend({
    'change input[type=text]': 'change',
    'change input[type=email]': 'change',
    'change input[type=password]': 'change',
    'change textarea': 'change',
    'submit form': '_submit'
  }, hs.views.View.prototype.events),
  fields:{},
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
    this.values = _.reduce(this.fields, function(val, field){
      val[field.name] = null;
      return val;
    }, {});
  },
  renderTmpl: function(){
    var ctx = {fields: this.fields};
    this._tmplContext.form = function(){
      return function(){
        return _.reduce(ich.form(ctx), function(htm, rx){
          return htm += rx.innerHTML || rx.nodeValue;
          }, '');
      }
    };
    return hs.views.View.prototype.renderTmpl.apply(this, arguments);
  },
  change: function(e){
    var name = $(e.target).attr('name')
    this.values[name] = $(e.target).val();
    this.trigger('change:'+name);
  },
  get: function(name){
    return this.values[name];
  },
  set: function(name, value){
    this.values[name] = value;
    this.$('[name="'+name+'"]').val(value);
    return this;
  },
  _submit: function(e){
    e.preventDefault();
    this.validate(_.bind(function(valid){
      if (valid){
        this.trigger('submit');
        if (this.submit) this.submit();
      }
    }, this));
  },
  validate: function(clbk){
    var len = _.keys(this.values).length;
    if (len == 0) return clbk(false);

    var valid = true,
        done = _.after(len, function(){clbk(valid)});

    _.each(this.values, _.bind(function(value, name){
      var methodName = 'validate'+name.charAt(0).toUpperCase() + name.slice(1);
      if (typeof this[methodName] == 'function')
        this[methodName](value, _.bind(function(valValid){
          if (!valValid) this.showInvalid(name);
          valid = valid && valValid;
          done();
        }, this));
      else done();
    }, this));
  },
  showInvalid: function(name){
    alert(name+' invalid');
    // var node = this.$('[name="'+name+'"]'),
    //     oldColor = node.css('backgroundColor');
    // node.animate({backgroundColor: '#f00'}, 200, function(){
    //   setTimeout(_.bind(function(){
    //     $(this).animate({backgroundColor: oldColor});
    //   }, this), 200);
    // });
  },
  toJSON: function(){
    return _.clone(this.values);
  }
}, Backbone.Events));