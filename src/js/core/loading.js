//depends: main.js

(function(){
  var loading = 0;

  var setLoading = function(){
    if (loading > 0){
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
    if (loading < 0){
      loading = 0;
      hs.error('loading < 0');
    }
    setLoading();
  }

  hs.resetLoading = function(){
    loading = 0;
    setLoading();
  }
})();
