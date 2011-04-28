//depends: main.js

(function(){
    var initStack = new Array(),
        initFired = false;

    hs.init = function(func, that){
        if (initFired) func.call(that);
        else initStack.push(_.bind(func, that));
    }

    $(function(){
        initFired = true;
        for (var i=0, len=initStack.length; i<len; i++)
            initStack[i]();
    });
})();