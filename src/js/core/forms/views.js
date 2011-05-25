//depends: core/views.js, core/forms/fields.js

hs.views.Form = hs.views.View.extend(_.extend({
  events: _.extend({
    'submit': '_submit'
  }, hs.views.View.prototype.events),
  fields:[],
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
    this.fields = _.reduce(this.fields, function(fields, field){
      fields[field.name] = new hs.views.fields.byType[field.type](field);
      return fields;
    }, {}, this);
  },
  render: function(){
    hs.views.View.prototype.render.apply(this, arguments);
    // re-delegate after render due to pre-load issues
    _.each(this.fields, function(field){
      field.el = this.$('#'+field.name);
      field.delegateEvents();
    }, this);
  },
  renderTmpl: function(){
    var fields = this.fields;
    this._tmplContext.form = function(){
      return function(){
        var htm = $('<div>');
        _.each(fields, function(field){
          field.appendTo = htm;
          field.render();
        });
        return htm.html();
      }
    };
    return hs.views.View.prototype.renderTmpl.apply(this, arguments);
  },
  get: function(name){
    return this.fields[name].get();
  },
  set: function(name, value){
    this.fields[name].set(value);
    return this;
  },
  clear: function(){
    _.each(this.fields, _.bind(function(field){
      this.set(field.name, '');
    }, this));
  },
  _submit: function(e){
    e.preventDefault();
    this.validate(_.bind(function(valid){
      if (valid){
        if (this.submit) this.submit();
        this.trigger('submit');
      }
    }, this));
  },
  validate: function(clbk){
    var len = _.keys(this.fields).length;
    if (len == 0) return clbk(false);

    var valid = true;
    var done = _.after(len, function(){clbk(valid)});

    _.each(this.fields, _.bind(function(field, name){
      if (!field.isValid()){
        valid = false;
        this.showInvalid(name);
        return done();
      }
      var methodName = 'validate'+name.charAt(0).toUpperCase() + name.slice(1);
      if (typeof this[methodName] == 'function')
        this[methodName](field.get(), _.bind(function(valValid){
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
    return _.reduce(_.values(this.fields), function(json, field){
      json[field.name] = field.get();
      return json;
    }, {}, this);
  }
}, Backbone.Events));