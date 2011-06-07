//depends: main.js, core/util.js, core/loading.js


hs.con = {
  connect: function(){
    hs.loading();
    var ioReady = _.bind(function(){
      this.socket = new io.Socket(conf.server.host, {
        port: conf.server.port
        // ,transports: ['xhr-multipart', 'xhr-polling', 'jsonp-polling']
      });
      this.socket.on('connect', this._connected);
      this.socket.on('message', this._recieved);
      this.socket.on('disconnect', this._disconnected);
      hs.log('connecting');
      this.socket.connect();
    }, this);

    if (typeof io == 'undefined'){
      hs.loadScript(conf.server.protocol+'://'
          +conf.server.host+':'+conf.server.port
          +'/socket.io/socket.io.js');
      (function ioCheck(){
        if (typeof io == 'undefined')
          setTimeout(ioCheck, 10);
        else
          ioReady();
      })();
    }else{
      ioReady();
    }
  },
  _isConnected: false,
  isConnected: function(clbk, context){
    if (!clbk) return this._isConnected;

    if (this._isConnected)
      clbk.call(context);
    else
      this.once('connected', clbk, context);
  },
  disconnect: function(clbk, context){
    if (clbk) this.once('disconnected', clbk, context);
    this.socket.disconnect();
  },
  reconnect: function(clbk, context){
    if (clbk) this.once('connected', clbk, context);
    this.disconnect(this.connect, this);
  },
  msgId: 1,
  send: function(key, data, clbk, context){
    var msgId = this.msgId++;
    this.isConnected(_.bind(function(){
      this.trigger('sending', key, data);
      this.trigger('sending:'+key, data);
      if (typeof data == 'undefined') data = {};
      data.id = msgId;
      var msg = key+':'+JSON.stringify(data);

      hs.loading();
      this.once('recieved:'+msgId, function(key, data){
        hs.loaded();
        if (clbk) clbk(data.value, data.error);
      });

      this.socket.send(msg);
      hs.log('sent:', msg);
    }, this));
    return msgId;
  },
  _connected: function(){
    hs.log('connected to server');
    hs.loaded();
    this._isConnected = true;
    this.trigger('connected');
  },
  _recieved: function(msg){
    hs.log('recd:', msg);

    var parsed = msg.split(':'),
        key = parsed.shift(),
        data = JSON.parse(parsed.join(':'));
    this.trigger('recieved', key, data);
    this.trigger('recieved:'+data.id, key, data);
    this.trigger(key, data);
  },
  _disconnected: function(){
    hs.log('disconnected from server');
    hs.loading();
    this._isConnected = false;
    this.trigger('disconnected');
  }
}
_.bindAll(hs.con);
_.extend(hs.con, Backbone.Events);

hs.con.connect();
