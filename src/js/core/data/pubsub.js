(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  dep.require('hs.con');
  dep.require('hs.auth');
  dep.provide('hs.pubsub');
  hs.pubsub = {
    subs: {},
    msgId: 0,
    init: true,
    pubRecieved: function(msg) {
      if (_.isUndefined(msg.key)) {
        return hs.error('pub with no key:', msg);
      }
      if (_.isUndefined(this.subs[msg.key])) {
        return this.unsub(msg.key);
      }
      return this.subs[msg.key](msg.diff);
    },
    connected: function() {
      if (this.init) {
        this.init = false;
        return;
      }
      return hs.auth.ready(__bind(function() {
        var handler, key, _ref, _results;
        _ref = this.subs;
        _results = [];
        for (key in _ref) {
          handler = _ref[key];
          _results.push(this._sub(key, __bind(function(fields, err) {
            return handler(fields);
          }, this)));
        }
        return _results;
      }, this));
    },
    sub: function(key, handler, clbk, context) {
      if (this.subs[key] != null) {
        throw 'This subscription is already taken';
      }
      this.subs[key] = handler;
      return this._sub(key, clbk, context);
    },
    _sub: function(key, clbk, context) {
      return hs.con.send('sub', {
        key: key
      }, __bind(function(value) {
        if (value === true) {
          throw 'double subscription error';
        }
        return clbk.apply(context, arguments);
      }, this));
    },
    unsub: function(key, clbk, context) {
      delete this.subs[key];
      return hs.con.send('unsub', {
        key: key
      }, clbk, context);
    }
  };
  _.extend(hs.pubsub, Backbone.Events);
  _.bindAll(hs.pubsub);
  hs.con.bind('pub', hs.pubsub.pubRecieved);
  hs.con.bind('connected', hs.pubsub.connected);
}).call(this);
