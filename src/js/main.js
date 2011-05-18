//depends: lib/main.js

var hs = new Object();

hs.log = function(){
  if (window.console && _.isFunction(console.log))
    console.log.apply(console, arguments);
};

hs.error = function(){
  if (window.console)
    if (typeof console.error === "function")
      console.error.apply(console, arguments);
    else if (typeof console.log === "function"){
      Array.prototype.unshift.call(arguments, 'Error:');
      console.log.apply(console, arguments);
    }
};

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
    if (this.initialize) this.initialize.apply(this, arguments);
  }
  hs.Object.extend = function(protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = arguments.callee;
    return child;
  };
})();
