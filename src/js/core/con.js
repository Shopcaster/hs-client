//depends: main.js


hs.con = {
  connect: function(){
    var ioReady = _.bind(function(){
      this.socket = new io.Socket(hs.API.host, {port: hs.API.port});
      this.socket.on('connect', _.bind(this.connected, this));
      this.socket.on('message', _.bind(this.recieved, this));
      this.socket.on('disconnect', _.bind(this.closed, this));
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
  connected: function(){
    this.trigger('connected');
  },
  recieved: function(msg){
    console.log('message revieved:', msg);

    parsed = /^(\w+):(.*)$/.exec(msg);
    if (parsed){
      var key = parsed[1], data = parsed[2];
      this.trigger('recieved', key, data);
      this.trigger('recieved:'+key, data);
    }
  },
  send: function(key, data){
    this.trigger('sending', key, data);
    this.trigger('sending:'+key, data);
    if (typeof data == 'undefined') data = {};
    this.socket.send(key+':'+JSON.stringify(data));
  },
  closed: function(){
    this.trigger('closed');
  }
}
_.bindAll(hs.con);
_.extend(hs.con, Backbone.Events);

hs.con.connect();