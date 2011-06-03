//depends: main.js

(function(){
  var initStack = new Array(),
    initFired = false;

  hs.init = function(func, that){
    if (initFired) func.call(that);
    else initStack.push(_.bind(func, that));
  }

  $(function(){
    var init = function(){
      initFired = true;
      for (var i=0, len=initStack.length; i<len; i++)
        initStack[i]();
    }

    // auto-load new application cache
    if (typeof window.applicationCache != 'undefined'){
      window.applicationCache.addEventListener('updateready', function(e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
          hs.loading();
          window.applicationCache.swapCache();
          window.location.reload();
        }
      }, false);
      window.applicationCache.addEventListener('noupdate', init, false);
    }else{
      init();
    }
  });
})();
