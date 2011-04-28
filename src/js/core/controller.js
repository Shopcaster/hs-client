//depends: main.js, core/init.js

hs.goTo = function(url){document.location.hash = '#'+url;};

(function(){
    var contClasses = new Object();

    hs.regController = function(name, Controller){
        contClasses[name] = Controller;
    };

    hs.init(function(){
        hs.controllers = new Object();
        _.each(contClasses, function(Controller, name){
            hs.controllers[name] = new Controller();
        });
        Backbone.history.start();
    });
})();

// hs.init(function(){
//     Backbone.history.start();
//     if (document.location.hash == '')
//         hs.controller.goTo('/');
// });

