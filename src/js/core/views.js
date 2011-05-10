//depends:main.js

hs.views = new Object();

hs.views.View = Backbone.View.extend({
  _tmplContext: _.defaults(this.options || {}, {}),
  events: {},
  rendered: false,
  render: function(){
    if (this.template){
      $(this.el).html(this.renderTmpl());
      this.rendered = true;
    }
    return this;
  },
  renderTmpl: function(){
    if (typeof this.template == 'undefined')
      throw('must define dialog template');
    var context = _.clone(this._tmplContext);
    if (this.model)
      context = _.extend(context, this.model.toJSON());
    return ich[this.template](context);
  }
});



hs.views.Page = hs.views.View.extend({
  id: 'main',
});


hs.views.Form = hs.views.View.extend(_.extend(Backbone.Events, {
  events: _.extend(hs.views.View.prototype.events, {
    'change input[type=text]': 'change',
    'change input[type=email]': 'change',
    'change input[type=password]': 'change',
    'change textarea': 'change',
    'submit form': '_submit'
  }),
  fields:{},
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
    this.values = _.clone(this.fields);
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
  }
}));




