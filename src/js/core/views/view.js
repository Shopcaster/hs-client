//depends:core/views/main.js, core/util.js

dep.require('hs.views');
dep.require('util');

dep.provide('hs.views.View');

hs.views.View = Backbone.View.extend(Backbone.Events).extend({
  _tmplContext: {},
  events: {},
  modelEvents: {},
  mixinEvents: {},
  rendered: false,

  initialize: function(opt){
    _.bindAll(this);
    _.each(this.mixinEvents, function(methods, event){
      _.each(methods, function(methodName){
        if (!_.isFunction(this[methodName]))
          throw(new Error('cannot bind mixin event "'+event
              +'" to non-existant method "'+methodName+'"'))
        this.bind(event, this[methodName]);
      }, this);
    }, this);

    this.trigger('initialized');
  },

  bindModelEvents: function(){
    if (this.model && this.modelEvents)
      _.each(this.modelEvents, function(method, event){

        parsed = /^(\w+):(\w+)$/.exec(event);
        if (_.isNull(parsed)) throw(new Error('invalid modelEvent key '+key));

        var eventType = parsed[1];
        var field = parsed[2];

        this.model.withField(field, function(){
          if (eventType == 'change')
            this[method].call(this);
          
          this.model.bind(event, this[method], this);
        }, this);
      }, this);
  },

  unbindModelEvents: function(){
    if (this.model)
      _.each(this.modelEvents, function(method, event){
        this.model.unbind(event, this[method]);
      }, this);
  },

  _configure: function(){
    Backbone.View.prototype._configure.apply(this, arguments);
    if (this.options.appendTo) this.appendTo = this.options.appendTo;
    if (this.options.prependTo) this.prependTo = this.options.prependTo;
  },

  render: function(){
    // render template
    if (this.el) this.el = $(this.el);
    if (this.template){
      var html = this.renderTmpl();
      if (this.appendTo || this.prependTo){
        this.el = $(html);
        this.delegateEvents();
        if (this.prependTo)
          this.el.prependTo(this.prependTo);
        else
          this.el.appendTo(this.appendTo);
      }else if (this.el){
        this.el.html(html);
      }else{
        throw(new Error('cannot render a view with neither el not appendTo set'));
      }
      this.rendered = true;
    }
    this.trigger('rendered');

    this.bindModelEvents();
  },

  renderTmpl: function(){
    if (typeof this.template == 'undefined')
      throw('must define dialog template');
    if (this.model)
      this._tmplContext = _.extend(this._tmplContext, this.model.toJSON());
    if (this.prepContext)
      this._tmplContext = this.prepContext(this._tmplContext);
    var html = ich[this.template](this._tmplContext);
    return html;
  },

  remove: function(){
    this.unbindModelEvents();
    this.el.remove();
    this.trigger('removed');
  }
});
