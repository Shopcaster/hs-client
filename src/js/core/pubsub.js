//depends: main.js, core/con.js

hs.pubsub = {
  subs: {},
  pubRecieved: function(data) {
    var key = data.key;
    if (typeof key == 'undefined')
      return hs.error('pub with no key:', data);
    this.subs[key] = this.subs[key] || [];
    _.each(this.subs[key], function(clbk){
      clbk(data.package);
    });
  },
  pub: function(key, data){
    hs.con.send('pub', {key: key, data: data});
  },
  sub: function(key, clbk) {
    this.subs[key] = this.subs[key] || [];
    if (_.indexOf(this.subs[key], clbk) == -1){
      this.subs[key].push(clbk);
      hs.con.send('sub', {key: key});
    }
  },
  unsub: function(key, clbk) {
    if (typeof clbk == 'undefined'){
      delete this.subs[key];
      hs.con.send('unsub', {key: key});
    }else{
      this.subs[key] = this.subs[key] || [];
      var i = _.indexOf(this.subs[key], clbk);
      if (i > -1) this.subs[key].splice(i, 1);
    }
  }
};
_.bindAll(hs.pubsub);

hs.con.bind('recieved:pub', hs.pubsub.pubRecieved);
