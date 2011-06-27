
dep.require('lib');
dep.provide('hs');

var hs = new Object();

hs.log = function(){
  if (hs.log.disabled) return;

  if (window.console && _.isFunction(console.log)){
    if (hs.log.concat){
      var op = '';
      _.each(_.toArray(arguments), function(arg){
        if (_.isString(arg))
          op += arg+' ';
        else
          op += JSON.stringify(arg);
      });
      console.log.call(console, _.toArray(arguments).join(' '))
    }else{
      console.log.apply(console, arguments);
    }
  }
};

hs.log.disabled = hs.log.disabled || false;
hs.log.concat = hs.log.concat || Modernizr.touch;

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
