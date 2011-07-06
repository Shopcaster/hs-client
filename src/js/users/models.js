
dep.require('hs.auth');
dep.require('hs.users');
dep.require('hs.models.Model');
dep.require('hs.con');

dep.provide('hs.users.User');

hs.users.User = hs.models.Model.extend({
  key: 'user',
  fields: _.extend({
    name: new hs.models.fields.StringField(),
    avatar: new hs.models.fields.StringField(),
    presence: new hs.models.fields.IntegerField(),
    fb: new hs.models.fields.IntegerField(),
    twitter: new hs.models.fields.IntegerField(),
    linkedin: new hs.models.fields.IntegerField()
  }, hs.models.Model.prototype.fields),

  initialize: function(){
    hs.models.Model.prototype.initialize.apply(this, arguments);

    if (this._id){
      hs.con.send('sub-presence', {user: this._id});
    }else
      this.once('change:_id', function(){
        hs.con.send('sub-presence', {user: this._id});
      }, this);

    hs.con.bind('recieved:presence', this.setPresence, this);
  },

  setPresence: function(data){
    if (data.user == this._id)
      this.set({presence: data.state}, {raw: true});
  },

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
    if (!_.isUndefined(id)) return oldGet.call(this, id);

    if (hs.auth.isAuthenticated()){
      if (_.isUndefined(user))
        user = oldGet.call(this, hs.auth.userId);
      return user;
    }else
      return null;
  }
})();
