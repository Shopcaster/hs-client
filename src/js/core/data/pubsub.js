
dep.require('hs.con');
dep.require('hs.auth');
dep.provide('hs.pubsub');

hs.pubsub = {
  subs: {},
  msgId: 0,
  init: true,

  pubRecieved: function(msg) {
    var key = msg.key;
    if (_.isUndefined(key))
      return hs.error('pub with no key:', msg);
    if (_.isUndefined(this.subs[key]))
      return this.unsub(key);
    _.each(this.subs[key], function(clbk){
      clbk(msg.diff);
    });
  },

  connected: function(){
    if (!this.init){
      hs.auth.ready(function(){
        _.each(this.subs, function(handlers, key){
          if (handlers.length) this._sub(key, function(fields, err){
            if (fields) _.each(handlers, function(handler){
              handler(fields);
            }, this);
          }, this);
        }, this);
      }, this);
    }
    this.init = false;
  },

  sub: function(key, handler, clbk, context) {
    var send = _.isUndefined(this.subs[key]);
    if (send) this.subs[key] = new Array();
    if (_.indexOf(this.subs[key], handler) == -1){
      this.subs[key].push(handler);
      if (send) return this._sub(key, clbk, context);
    }
  },

  _sub: function(key, clbk, context){
    return hs.con.send('sub', {key: key}, clbk, context);
  },

  unsub: function unsub(key, clbk) {
    if (typeof clbk == 'undefined'){
      delete this.subs[key];
      return hs.con.send('unsub', {key: key});
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

_.extend(hs.pubsub, Backbone.Events);
_.bindAll(hs.pubsub);

hs.con.bind('pub', hs.pubsub.pubRecieved);
hs.con.bind('connected', hs.pubsub.connected);
