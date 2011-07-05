
dep.require('hs.views.Form');
dep.require('hs.views.Page');
dep.require('hs.settings.views');
dep.provide('hs.settings.views.Password');
dep.provide('hs.settings.views.PasswordForm');

hs.settings.views.Password = hs.views.Page.extend({
  template: 'password',
  initialize: function(){
    hs.views.Page.prototype.initialize.apply(this, arguments);
  },
  render: function(){
    hs.views.Page.prototype.render.apply(this, arguments);
    this.form = new hs.settings.views.PasswordForm({
      appendTo: $('#password-form')
    });
    this.form.render();
  }
});

hs.settings.views.PasswordForm = hs.views.Form.extend({
  template: 'passwordForm',
  fields: [{
    'name': 'oldPassword',
    'type': 'password',
    'placeholder': 'Old Password'
  }, {
    'name': 'newPassword',
    'type': 'password',
    'placeholder': 'New Password'
  }, {
    'name': 'newPassword2',
    'type': 'password',
    'placeholder': 'New Password (again)'
  }],
  validateNewPassword: function(val, callback) {
    callback(val == this.get('newPassword2'));
  },
  validateNewPassword2: function(val, callback) {
    callback(val == this.get('newPassword'));
  },
  render: function(){
    hs.views.Form.prototype.render.apply(this, arguments);
    this.user = hs.users.User.get();
  },
  submit: function(){
    hs.auth.changePassword(this.get('oldPassword'), this.get('newPassword'), function(worked){
      if (worked) {
        hs.auth.setPassword(this.get('newPassword'));
        this.clear();
      } else {
        // TODO - invalid old password
      }
    }, this);
  }
});
