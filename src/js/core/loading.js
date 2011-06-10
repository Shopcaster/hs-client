//depends: main.js

(function(){
  var loading = 0;

  var setLoading = function(){
    if (loading){
      $('#loading').show();
    }else{
      $('#loading').hide();
    }
  }

  hs.loading = function(){
    loading++;
    setLoading();
  }

  hs.loaded = function(){
    loading--;
    setLoading();
  }

  hs.resetLoading = function(){
    loading = 0;
    setLoading();
  }
})();
