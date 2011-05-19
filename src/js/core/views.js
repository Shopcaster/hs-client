//depends:main.js

hs.views = new Object();

hs.views.View = Backbone.View.extend({
  _tmplContext: {},
  events: {},
  modelEvents: {},
  rendered: false,
  initialize: function(opt){
    _.bindAll(this);
    // bind modelEvents
    if (this.model)
      _.each(this.modelEvents, _.bind(function(method, event){
        this.model.bind(event, _.bind(this[method], this));
      }, this));
  },
  _configure: function(){
    Backbone.View.prototype._configure.apply(this, arguments);
    if (this.options.appendTo) this.appendTo = this.options.appendTo;
  },
  render: function(){
    // render template
    if (this.template){
      var html = this.renderTmpl();
      if (this.appendTo){
        this.el = html;
        this.delegateEvents();
        $(this.appendTo).append(html);
      }else if (this.el){
        $(this.el).html(html);
      }else{
        throw(new Error('cannot render a view with neither el not appendTo set'));
      }
      this.rendered = true;
    }
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



hs.views.Page = hs.views.View.extend({
  id: 'main',
});
