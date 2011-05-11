//depends: main.js


hs.con = {
  connect: function(){
    var ioReady = _.bind(function(){
      this.socket = new io.Socket(hs.API.host, {port: hs.API.port});
      this.socket.on('connect', this._connected);
      this.socket.on('message', this._recieved);
      this.socket.on('disconnect', this._closed);
      this.socket.connect();
    }, this);

    if (typeof io == 'undefined'){
      var script = document.createElement("script");
      script.src = hs.API.protocol+'://'+hs.API.host+':'+hs.API.port
          +'/socket.io/socket.io.js';
      document.body.appendChild(script);
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
  isConnected: function(clbk){
    if (!clbk && this._isConnected) return true;
    else if (this._isConnected) clbk();
    else if (!clbk) return false;
    else this.bind('connected', clbk);
  },
  send: function(key, data){
    this.isConnected(_.bind(function(){
      this.trigger('sending', key, data);
      this.trigger('sending:'+key, data);
      if (typeof data == 'undefined') data = {};
      var msg = key+':'+JSON.stringify(data);
      this.socket.send(msg);
    console.log('sent:', msg);
    }, this));
  },
  _connected: function(){
    this._isConnected = true;
    this.trigger('connected');
  },
  _recieved: function(msg){
    console.log('revieved:', msg);

    var parsed = /^(\w+):(.*)$/.exec(msg);
    if (parsed){
      var key = parsed[1], data = JSON.parse(parsed[2]);
      this.trigger('recieved', key, data);
      this.trigger('recieved:'+key, data);
      this.trigger(key, data);
    }
  },
  _closed: function(){
    this.trigger('closed');
  }
}
_.bindAll(hs.con);
_.extend(hs.con, Backbone.Events);

hs.con.connect();