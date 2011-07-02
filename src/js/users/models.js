
dep.require('hs.auth');
dep.require('hs.users');
dep.require('hs.models.Model');

dep.provide('hs.users.User');

hs.users.User = hs.models.Model.extend({
  key: 'user',
  fields: _.extend({
    name: '',
    avatar: ''
  }, hs.models.Model.prototype.fields),
  getAvatarUrl: function(size){
    size = size || 60;
    var avy = this.get('avatar');
    var tail = '?d=mm&s='+size;

    if (/^http:\/\/(www\.)?gravitar\.com/.test(avy))
      return avy+tail;
    else
      return 'http://www.gravatar.com/avatar/'+avy+tail;
  }
});

(function(){
  var oldGet = hs.users.User.get;
  var user;
  hs.auth.bind('change:userId', function(){user = undefined});

  hs.users.User.get = function(id){
    if (!_.isUndefined(id)) return oldGet.apply(this, arguments);

    if (hs.auth.isAuthenticated()){
      if (_.isUndefined(user))
        user = oldGet.call(this, hs.auth.userId);
      return user;
    }else
      return null;
  }
})();
