
dep.require('hs.init');
dep.provide('hs.Controller');

hs.Controller = Backbone.Controller.extend({});

(function(){
  //figure out if we can use HTML5 history
  var canUseHistory = (window.history.pushState && true) || false;
  canUseHistory = false; //disabling this for now

  var contClasses = new Object();

  if (!canUseHistory) {
    hs.goTo = function(url) {
      document.location.hash = '#'+url;
    };
  } else {
    hs.goTo = function(url) {
      hs.log('goTo: '+url);
      window.history.pushState(null, null, url.substr(1));
    };
  }

  hs.regController = function(name, Controller){
    contClasses[name] = Controller;
  };

  hs.init(function(){
    hs.controllers = new Object();
    _.each(contClasses, function(Controller, name){
      hs.controllers[name] = new Controller();
      //if we can't use HTML5 history, insert ! for google juice
      if (canUseHistory) {
        var c = hs.controllers[name];
        for (r in c.routes) if (c.routes.hasOwnProperty(r)) {
          var t = c.routes[r];
          delete c.routes[r];
          c.routes[r.substr(1)] = t;
        }
      }
    });
    //if we're not using HTML5 history, fall back to backbone's handler
    if (!canUseHistory) {
      Backbone.history.start();
      Backbone.history.bind('loadUrl', function(fragment){
        mpq.push(['track', 'page load', {hash: fragment}]);
      });
    //otherwise, we have to manually trigger backbone's stuff
    } else {
      window.onpopstate = function(e) {
        var url = window.location.pathname;
        //todo - do something with this
        console.log(url);
      };
    }
  });
})();

