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

    init();

    if (window.applicationCache)
      window.applicationCache.addEventListener('updateready', function(e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
          window.applicationCache.swapCache();
          hs.nots.send('A new version of Hipsell is available! Refresh the page to update.');
          // window.location.reload();
        }
      }, false);
    // if (window.noupdate === false){
    //   window.onNoUpdate = init;
    // }else{
    //   init();
    // }
  });
})();
