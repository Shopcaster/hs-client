//depends:main.js

hs.views = new Object();

hs.views.View = Backbone.View.extend({
  _renderWith: 'html',
  _tmplContext: {},
  events: {},
  modelEvents: {},
  rendered: false,
  initialize: function(opt){
    _.bindAll(this);
    if (this.model)
      _.each(this.modelEvents, _.bind(function(method, event){
        this.model.bind(event, _.bind(this[method], this));
      }, this));
  },
  render: function(){
    if (this.template){
      var html = this.renderTmpl();
      $(this.el)[this._renderWith](html);
      this.rendered = true;
    }
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
    var context = _.clone(this._tmplContext);
    if (this.model)
      context = _.extend(context, this.model.toJSON());
    var html = ich[this.template](context);
    return html;
  }
});



hs.views.Page = hs.views.View.extend({
  id: 'main',
});
