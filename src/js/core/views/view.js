//depends:core/views/main.js, core/util.js

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

    // bind modelEvents
    if (this.model)
      _.each(this.modelEvents, _.bind(function(method, event){
        this.model.bind(event, _.bind(this[method], this));
      }, this));
    this.trigger('initialized');
  },
  _configure: function(){
    Backbone.View.prototype._configure.apply(this, arguments);
    if (this.options.appendTo) this.appendTo = this.options.appendTo;
  },
  render: function(){
    // render template
    if (this.el) this.el = $(this.el);
    if (this.template){
      var html = this.renderTmpl();
      if (this.appendTo){
        this.el = $(html);
        this.delegateEvents();
        $(this.appendTo).append(html);
      }else if (this.el){
        this.el.html(html);
      }else{
        throw(new Error('cannot render a view with neither el not appendTo set'));
      }
      this.rendered = true;
    }
    this.trigger('rendered');
    // call all "change"-type modelEvents
    if (this.model)
      _.each(this.modelEvents, _.bind(function(method, event){
        event = /^(\w+):(\w+)$/.exec(event);
        if (event && event[1] == 'change'
            && !_.isUndefined(this.model.get(event[2])))
          this[method]();
      }, this));
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
  }
});

// hs.views.View.mixin = function(mixin) {
//   mixin = _.clone(mixin);
//   var view = this.extend({});
//   var events = mixin.events;
//   var mixinEvents = _.clone(this.prototype.mixinEvents);
//   if (events){
//     delete mixin.events;
//     _.each(events, function(method, type){
//       mixinEvents[type] = mixinEvents[type] || [];
//       mixinEvents[type].push(method);
//     }, this);
//   }
//   view.prototype = _.extend({}, mixin, view.prototype, {mixinEvents: mixinEvents});
//   return view;
// };

// hs.views.View.extend = function(){
//   var View = Backbone.Model.extend.apply(this, arguments);
//   View.mixin = hs.views.View.mixin;
//   View.extend = arguments.callee;
//   return View;
// };
