//depends: main.js, core/con.js

hs.auth = {
  init: function(){
    this.pass = localStorage.getItem('pass');
    this.email = localStorage.getItem('email');
    if (this.email && this.pass)
      this.login();
  },
  _isAuthenticated: false,
  isAuthenticated: function(){
    return this._isAuthenticated;
  },
  setEmail: function(email){
    this.email = email;
    localStorage.setItem('email', this.email);
    this.trigger('change:email');
  },
  setPassword: function(pass){
    if (_.isUndefined(this.email))
      throw(new Error('must set email before password'));
    this.pass = this.hash(this.email, pass);
    localStorage.setItem('pass', this.pass);
    this.trigger('change:pass');
  },
  signup: function(email, clbk){
    if (_.isFunction(email)){
      clbk = email;
      email = undefined;
    } else if (email){
      this.setEmail(email);
    }

    var msgId = hs.con.send('auth', {email: this.email});
    hs.con.bind('recieved:'+msgId, function(key){
      if (key == 'auth-ok'){
        this.trigger('change:isAuthenticated', true);
        this._isAuthenticated = true;
        if (clbk) clbk();
      }else if  (key == 'auth-bad')
        if (clbk) clbk(new Error('required:password'));
      else
        if (clbk) clbk(new Error('unknown auth response: '+key));
    });
  },
  login: function(email, pass, clbk){
    if (_.isFunction(email)){
      clbk = email;
      email = undefined;
      pass = undefined;
    }else if (_.isFunction(pass)){
      clbk = pass;
      pass = undefined;
    }
    if (email) this.setEmail(email);
    if (pass) this.setPassword(pass);

    var msgId = hs.con.send('auth', {email: this.email, password: this.pass});
    hs.con.bind('recieved:'+msgId, _.bind(function(key){
      if (key == 'auth-ok'){
        this.trigger('change:isAuthenticated', true);
        this._isAuthenticated = true;
        if (clbk) clbk();
      }else if  (key == 'auth-bad')
        if (clbk) clbk(new Error('invalid:password'));
      else
        if (clbk) clbk(new Error('unknown auth response: '+key));
    }, this));
  },
  logout: function(clbk){
    this.pass = undefined;
    this.email = undefined;
    localStorage.removeItem('pass');
    localStorage.removeItem('email');
    this.trigger('change:pass');
    this.trigger('change:email');
    this._isAuthenticated = false;
    hs.con.reconnect(_.bind(function(){
      if (clbk) clbk();
      this.trigger('change:isAuthenticated', false);
    }, this));
  },
  hash: function(email, pass){
    console.log(pass+email);
    return Crypto.SHA256(pass+email);
  }
}
_.bindAll(hs.auth);
_.extend(hs.auth, Backbone.Events);
hs.auth.init();
