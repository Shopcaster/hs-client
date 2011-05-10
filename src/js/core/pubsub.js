//depends: main.js, core/con.js

hs.pubsub = {
  subs: {},
  pubRecieved: function(msg) {
    var key = msg.key;
    if (_.isUndefined(key))
      return hs.error('pub with no key:', msg);
    if (_.isUndefined(this.subs[key]))
      return this.unsub(key);
    _.each(this.subs[key], function(clbk){
      clbk(msg.data);
    });
  },
  pub: function(key, data, extra){
    hs.con.send('pub', _.extend(extra || {}, {key: key, data: data}));
  },
  sub: function(key, clbk) {
    var send = _.isUndefined(this.subs[key]);
    if (send) this.subs[key] = new Array();
    if (_.indexOf(this.subs[key], clbk) == -1){
      this.subs[key].push(clbk);
      if (send) hs.con.send('sub', {key: key});
    }
  },
  unsub: function unsub(key, clbk) {
    if (typeof clbk == 'undefined'){
      delete this.subs[key];
      hs.con.send('unsub', {key: key});
    }else{
      if (_.isUndefined(this.subs[key])) return;
      var i = _.indexOf(this.subs[key], clbk);
      if (i > -1)
        this.subs[key].splice(i, 1);
      if (this.subs[key].length == 0)
        unsub(key);
    }
  }
};
_.bindAll(hs.pubsub);

hs.con.bind('recieved:pub', hs.pubsub.pubRecieved);

Backbone.sync = function(method, model, success, error){
  if (method == 'update' || method == 'create'){
    hs.pubsub.pub(model.key, model.toJSON());
  }else if (method == 'read' && model.key == 'listing'){
    // fake out!
    success({"active": true, "best_offer": null, "created_on": "2011-05-02T15:40:06.629056", "description": "MacBook Pro for sale. Excellent condition and fully loaded. 8GB RAM 64GB SSD. Must see. ", "id": "40", "latitude": 43.651702, "longitude": -79.373703000000006, "modified_on": "2011-05-02T15:40:06.629088", "photo": {"original": "http://lorempixum.com/560/418/technics/", "web": "http://lorempixum.com/560/418/technics/"}, "price": 1500.0, "resource_uri": "/api/v1/listing/40/", "user": "/api/v1/user/3/"});
  }
};
