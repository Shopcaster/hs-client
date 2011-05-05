//depends: lib/main.js

var hs = new Object();

hs.API_DOMAIN = 'dev.hipsell.com';
hs.API_PATH = '/api/v1/';
hs.API_URL = 'http://'+hs.API_DOMAIN+hs.API_PATH;

hs.log = function(){
  if (window.console && typeof console.log === "function")
    console.log.apply(console, arguments);
}

hs.error = function(){
  if (window.console)
    if (typeof console.error === "function")
      console.error.apply(console, arguments);
    else if (typeof console.log === "function"){
      Array.prototype.unshift.call(arguments, 'Error:');
      console.log.apply(console, arguments);
    }
}
