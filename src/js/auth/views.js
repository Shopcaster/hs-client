//depends: core/views/view.js,
//    auth/main.js,
//    core/init.js,
//    auth/login.js,
//    auth/settings.js

hs.auth = hs.auth || new Object();
hs.auth.views = new Object();

hs.auth.views.Login = hs.views.View.extend({
  events: {
    'click .logout': 'logout'
  },
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);

    hs.auth.bind('change:isAuthenticated', this.authChange, this);
    this.authChange(hs.auth.isAuthenticated());

    this.settings = new hs.auth.Settings();
    this.loginForm = new hs.auth.LoginForm();
  },
  logout: function(e){
    e.preventDefault();
    hs.auth.logout();
  },
  authChange: function(){
    if (hs.auth.isAuthenticated())
      this.renderLoggedIn();
    else
      this.renderLoggedOut();
  },
  renderLoggedIn: function(){
    $('#top-bar a.login').hide();
    $('#top-bar a.logout').show();
    $('#top-bar a.settings').show();

    this.user = hs.auth.getUser();
    this.user.bind('change:name', this.renderLoggedIn, this);

    var name = this.user.get('name');
    if (_.isUndefined(name)){
      $('#top-bar > .width > a.name').html(hs.auth.email
          +' <span id="set-name">(<span class="red">'
          +'set public name!</span>)</span>').show();
    }else{
      $('#top-bar > .width > a.name').text(name).show();
    }

  },
  renderLoggedOut: function(){
    $('#top-bar a.login').show();
    $('#top-bar a.logout').hide();
    $('#top-bar a.settings').hide();
    $('#top-bar > .width > a.name').hide().text('');
  }
});

hs.init(function(){
  hs.auth.views.login = new hs.auth.views.Login({el: $('#top-bar')});
});


hs.auth.views.AuthForm = hs.views.Form.extend({
  fields: [{
      'name': 'email',
      'type': 'email',
      'placeholder': 'Email',
      'hide': true
    },{
      'name': 'password',
      'type': 'password',
      'placeholder': 'Password',
      'hide': true
  }],
  render: function(){
    hs.views.Form.prototype.render.apply(this, arguments);
    if (!hs.auth.isAuthenticated())
      this.$('[name=email]').show();
    hs.auth.bind('change:isAuthenticated', function(isA){
      if (isA){
        this.$('[name=email]').hide();
        this.$('[name=password]').hide();
      }else{
        this.$('[name=email]').show();
      }
    }, this);
  },
  renderLogin: function(){
    this.$('[name=password]').show();
  },
  _submit: function(e){
    e.preventDefault();

    this._validate(function(valid){
      var sub = function(){
        if (this.submit) this.submit();
        this.trigger('submit');
      }
      if (valid){
        if (hs.auth.isAuthenticated()){
          sub.call(this);
        }else if (this.$('[name=password]:visible').length){
          this.login(sub, this);
        }else{
          this.signup(sub, this);
        }
      }
    }, this);
  },
  login: function(clbk, context){
    var email = this.$('[name=email]').val(),
        password = this.$('[name=password]').val();

    hs.auth.login(email, password, _.bind(function(err){
      if (err)
        this.showInvalid('password');
      else if (clbk)
        clbk.call(context);
    }, this));
  },
  signup: function(clbk, context){
    var email = this.$('[name=email]').val();

    hs.auth.signup(email, _.bind(function(err){
      if (err)
        this.renderLogin();
      else if (clbk)
        clbk.call(context);
    }, this));
  },
  validatePassword: function(password, clbk){
    clbk(this.$('[name=password]:visible').length == 0
        || (password && password.length > 0));
  },
  validateEmail: function(email, clbk){
    clbk(this.$('[name=email]:visible').length == 0
        || (email
          && /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)));
  }
});
