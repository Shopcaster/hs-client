//depends: main.js, core/util.js

// Backbone-like extendable base object
(function(){
  var ctor = function(){};
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    if (protoProps && protoProps.hasOwnProperty('constructor'))
      child = protoProps.constructor;
    else
      child = function(){ return parent.apply(this, arguments); };

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    if (protoProps) _.extend(child.prototype, protoProps);
    if (staticProps) _.extend(child, staticProps);

    child.prototype.constructor = child;
    child.__super__ = parent.prototype;

    return child;
  };

  hs.Object = function(){
    if (this.mixins)
      _.each(this.mixins, function(mixin){
        _.bindAllTo(mixin, this);
        if (mixin.events)
          _.each(mixin.events, function(event, clbkName){
            this.bind(event, mixin[clbkName]);
          }, this);
      }, this);
    if (this.initialize) this.initialize.apply(this, arguments);
  }
  hs.Object.extend = function(protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = arguments.callee;
    return child;
  };
  hs.Object = hs.Object.extend(Backbone.Events);
  hs.Object.mixin = function(mixin) {
    this.prototype.mixins = this.prototype.mixins || [];
    this.prototype.mixins.push(mixin);
    return this;
  };
})();
