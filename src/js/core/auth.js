//depends:
// main.js,
// core/data/conn.js

hs.auth = {
  init: function(){
    this.pass = localStorage.getItem('pass');
    this.email = localStorage.getItem('email');
    if (this.email && this.pass && hs.con.isConnected())
      this.login();
    hs.con.bind('connected', function(){
      if (this.email && this.pass)
        this.login();
    }, this);
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
  setPassword: function(pass, hash){
    if (_.isUndefined(this.email))
      throw(new Error('must set email before password'));

    if (hash === false) this.pass = pass;
    else this.pass = this.hash(this.email, pass);

    localStorage.setItem('pass', this.pass);
    this.trigger('change:pass');
  },
  setUserId: function(userId){
    // fakeout for now
    if (_.isUndefined(userId)) userId = 1;
    this.userId = userId;
    localStorage.setItem('userId', this.userId);
    this.trigger('change:userId');
  },
  signup: function(email, clbk, context){
    if (_.isFunction(email)){
      clbk = email;
      email = undefined;
    } else if (email){
      this.setEmail(email);
    }

    hs.con.send('auth', {email: this.email},
        _.bind(this._handleResponse, this, clbk, context));
  },
  login: function(email, pass, clbk, context){
    if (_.isFunction(email)){
      clbk = email;
      context = pass;
      email = undefined;
      pass = undefined;
    }else if (_.isFunction(pass)){
      context = clbk;
      clbk = pass;
      pass = undefined;
    }
    if (email) this.setEmail(email);
    if (pass) this.setPassword(pass);

    hs.con.send('auth', {email: this.email, password: this.pass},
        _.bind(this._handleResponse, this, clbk, context));
  },
  changePassword: function(oldPass, newPass, clbk, context){
    hs.con.send('passwd', {
      old: oldPass,
      password: newPass
    }, clbk, context);
  },
  _handleResponse: function(clbk, context, data){
    if (data){
      this.setUserId(data.userid);
      if (data.password)
        this.setPassword(data.password, false);
      this._isAuthenticated = true;
      this.trigger('change:isAuthenticated', this._isAuthenticated);
      if (clbk) clbk.call(context);
      mpq.push(['identify', data.userid]);
    }else if (clbk){
      clbk.call(context, new Error('auth error'));
    }else{
      this.logout();
    }
  },
  logout: function(clbk, context){
    this.pass = undefined;
    this.email = undefined;
    this.userId = undefined;
    localStorage.clear();
    this.trigger('change:pass');
    this.trigger('change:email');
    this.trigger('change:userId');
    if (this.isAuthenticated()){
      hs.con.reconnect(clbk, context);
      this._isAuthenticated = false;
      this.trigger('change:isAuthenticated', this._isAuthenticated);
    }else if (clbk)
      clbk.call(context);
  },
  hash: function(email, pass){
    return Crypto.SHA256(pass+email).toUpperCase();
  }
}
_.bindAll(hs.auth);
_.extend(hs.auth, Backbone.Events);
hs.auth.init();
