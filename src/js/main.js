//depends: lib/main.js

var hs = new Object();

hs.log = function(){
  if (hs.log.disabled) return;

  if (window.console && _.isFunction(console.log)){
    if (hs.log._concat){
      var op = '';
      _.each(arguments, function(arg){
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

hs.log.disabled = false;
hs.log.disable = function(){
  hs.log.disabled = true;
};

hs.log._concat = false;
hs.log.concat = function(){
  hs.log._concat = true;
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
