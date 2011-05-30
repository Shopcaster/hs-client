//depends: main.js, core/data/conn.js

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
  setUserId: function(userId){
    // fakeout for now
    if (_.isUndefined(userId)) userId = 1;
    this.userId = userId;
    localStorage.setItem('userId', this.userId);
    this.trigger('change:userId');
  },
  signup: function(email, clbk){
    if (_.isFunction(email)){
      clbk = email;
      email = undefined;
    } else if (email){
      this.setEmail(email);
    }

    hs.con.send('auth', {email: this.email}, _.bind(function(data){
      if (data){
        this.setUserId(data.userid);
        this.setPassword(data.password);
        this._isAuthenticated = true;
        this.trigger('change:isAuthenticated', this._isAuthenticated);
        if (clbk) clbk();
      }else if (clbk)
        clbk(new Error('required:password'));
    }, this));
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

    hs.con.send('auth', {email: this.email, password: this.pass},
        _.bind(function(data){
          if (data){
            this.setUserId(data.userid);
            this._isAuthenticated = true;
            this.trigger('change:isAuthenticated', this._isAuthenticated);
            if (clbk) clbk();
          }else{
            if (clbk) clbk(new Error('invalid:password'));
            else this.logout();
          }
        }, this));
  },
  logout: function(clbk){
    this.pass = undefined;
    this.email = undefined;
    this.userId = undefined;
    localStorage.removeItem('pass');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    this.trigger('change:pass');
    this.trigger('change:email');
    this.trigger('change:userId');
    hs.con.reconnect();
    this._isAuthenticated = false;
    this.trigger('change:isAuthenticated', this._isAuthenticated);
    if (clbk) clbk();
  },
  hash: function(email, pass){
    return Crypto.SHA256(pass+email);
  }
}
_.bindAll(hs.auth);
_.extend(hs.auth, Backbone.Events);
hs.auth.init();
