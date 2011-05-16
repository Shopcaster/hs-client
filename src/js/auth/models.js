//depends: auth/main.js, core/models/model.js

hs.auth.models = new Object();

hs.auth.models.User = hs.models.Model.extend({
  key: 'user',
  fields: _.extend({
    name: '',
    email: ''
  }, hs.models.Model.prototype.fields)
});

hs.auth.getUser = (function(){
  var user;
  return function(){
    if (hs.auth.isAuthenticated()){
      if (_.isUndefined(user))
        user = new hs.auth.models.User({id: hs.auth.userId});
      return user;
    }else return null;
  }
})();
