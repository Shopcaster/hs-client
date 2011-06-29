
dep.require 'hs.con'
dep.require 'hs.auth'
dep.provide 'hs.pubsub'

hs.pubsub =
  subs: {}
  msgId: 0
  init: true

  pubRecieved: (msg) ->
    if _.isUndefined msg.key
      return hs.error 'pub with no key:', msg

    if _.isUndefined this.subs[msg.key]
      return this.unsub msg.key

    this.subs[msg.key] msg.diff


  connected: ->
    if this.init
      this.init = false
      return

    hs.auth.ready =>
      for key, handler of this.subs
        this._sub key, (fields, err) =>
          handler fields


  sub: (key, handler, clbk, context) ->
    if this.subs[key]? then throw 'This subscription is already taken'

    this.subs[key] = handler
    this._sub key, clbk, context


  _sub: (key, clbk, context) ->
    hs.con.send 'sub', {key: key}, clbk, context


  unsub: (key, clbk, context) ->
    delete this.subs[key]
    hs.con.send 'unsub', {key: key}, clbk, context


_.extend hs.pubsub, Backbone.Events
_.bindAll hs.pubsub

hs.con.bind 'pub', hs.pubsub.pubRecieved
hs.con.bind 'connected', hs.pubsub.connected
