//depends: main.js, core/auth/dialog.js

hs._Auth = function(){
    if (hs.auth instanceof hs._Auth)
        throw('hs._Auth is not to be instantiated other then for hs.auth');
    
    this.token = localStorage.getItem('token');
    this.email = localStorage.getItem('email');
    _.extend(this, Backbone.Events);
};

hs._Auth.prototype.isAuthenticated = function(){
    return typeof this.token == 'string';
};

hs._Auth.prototype.authenticated = function(clbk, context){
    clbk = _.bind(clbk, context);
    if (this.isAuthenticated()){
        clbk();
        return this;
    }
    if (typeof this.email == 'undefined')
        this.loginPrompt(clbk);
    else
        this._createUser(clbk);
    return this;
};

hs._Auth.prototype.setEmail = function(email){
    this.email = email;
    localStorage.setItem('email', this.email);
    this.trigger('change:email', this.email);
    return this;
};

hs._Auth.prototype.setPassword = function(password){
    this.password = password;
    this.trigger('change:password', this.password);
    return this;
};

hs._Auth.prototype.setToken = function(token){
    this.token = token;
    localStorage.setItem('token', this.token);
    this.trigger('change:token', this.token);
    this.trigger('change:isAuthenticated', true);
    return this;
};

hs._Auth.prototype._createUser = function(clbk){
    if (typeof this.email == 'undefined')
        throw('cannot create a user with no email');
    $.ajax({
        url: '/api/v1/user/', 
        data: JSON.stringify({username: this.email}), 
        contentType: 'application/json',
        type: 'POST',
        context: this,
        complete: function(jqXHR){
            if (jqXHR.status == 201){
                this.setToken(JSON.parse(jqXHR.responseText).token);
                clbk();
            }else{
                hs.log('err', jqXHR);
                hs.log('TODO: password prompt and login');
            }
        }
    });
    return this;
};

hs._Auth.prototype._loginUser = function(clbk){
    if (typeof this.email == 'undefined' || typeof this.password == 'undefined')
        throw('cannot login a user with no email or password');
    $.ajax({
        url: '/api/v1/auth/',
        contentType: 'application/json',
        type: 'GET',
        context: this,
        beforeSend: function(jqXHR){
            jqXHR.setRequestHeader('Authorization', 'Basic '
                    +Base64.encode(this.email+':'+this.password));
        },
        complete: function(jqXHR){
            if (jqXHR.status == 200){
                this.setToken(JSON.parse(jqXHR.responseText).token);
                clbk();
            }else{
                hs.log('err', jqXHR);
                hs.log('TODO: handle login error');
            }
        }
    });
    return this;
};

hs._Auth.prototype.loginPrompt = function(clbk, options){
    if (typeof clbk == 'object'){
        options = clbk;
        clbk = function(){};
    }else if(typeof clbk == 'undefined'){
        options = new Object();
        clbk = function(){};
    }
    new hs.auth.Dialog(_.extend(options, {
        submit: _.bind(function(email, password){
            if (typeof password != 'undefined')
                this.login(email, password, clbk);
            else
                this._createUser(clbk);
        }, this)
    })).render();
    return this;
};

hs._Auth.prototype.login = function(email, password, clbk){
    this.setEmail(email).setPassword(password)._loginUser(clbk);
};

hs._Auth.prototype.logout = function(){
    this.token = undefined;
    this.email = undefined;
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.trigger('change:token');
    this.trigger('change:isAuthenticated', false);
    return this;
};

hs.auth = _.extend(hs.auth || new Object(), new hs._Auth());