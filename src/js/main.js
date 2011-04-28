//depends: lib/main.js

var hs = new Object();

hs.API_URL = '/api/v1/';

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
