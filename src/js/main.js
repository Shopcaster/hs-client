//depends: lib/main.js

var hs = new Object();

hs.log = function(){
  if (hs.log.disabled) return;

  if (window.console && _.isFunction(console.log))
    console.log.apply(console, arguments);
};

hs.log.disabled = false;
hs.log.disable = function(){
  hs.log.disabled = true;
};

hs.error = function(){
  if (hs.log.disabled) return;

  if (window.console)
    if (typeof console.error === "function")
      console.error.apply(console, arguments);
    else if (typeof console.log === "function"){
      Array.prototype.unshift.call(arguments, 'Error:');
      console.log.apply(console, arguments);
    }
};
