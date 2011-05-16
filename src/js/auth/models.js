//depends: auth/main.js, core/models/model.js

hs.auth.models = new Object();

hs.auth.models.User = hs.models.Model.extend({
  key: 'user',
  fields: _.extend({
    name: '',
    avatar: ''
  }, hs.models.Model.prototype.fields),
  getAvatarUrl: function(){
    return 'http://www.gravatar.com/avatar/'+this.get('avatar')+'?d=mm&s=60';
  }
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
