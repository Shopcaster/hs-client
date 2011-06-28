
dep.require('hs.views.Form');
dep.require('hs.auth');
dep.require('hs.views.mixins.Dialog');

dep.provide('hs.users.views.Settings');
dep.provide('hs.users.views.NameForm');
dep.provide('hs.users.views.PasswordForm');


hs.users.views.Settings = hs.views.View.mixin(hs.views.mixins.Dialog).extend({
  appendTo: $('#top-bar .width'),
  template: 'settings',
  focusSelector: '#top-bar .settings',
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
    this.nameForm = new hs.users.views.NameForm();
    this.passwordForm = new hs.users.views.PasswordForm();
  },
  focus: function(){
    hs.views.mixins.Dialog.focus.apply(this, arguments);
    this.nameForm.dialogSetMousedown();
    this.passwordForm.dialogSetMousedown();
  }
});

hs.users.views.NameForm = hs.views.Form.mixin(hs.views.mixins.Dialog).extend({
  appendTo: $('#top-bar .width'),
  template: 'nameForm',
  focusSelector: '#top-bar .name',
  fields: [{
    'name': 'name',
    'type': 'text',
    'placeholder': 'Name'
  }],
  render: function(){
    hs.views.Form.prototype.render.apply(this, arguments);
    this.user = this.user || hs.users.User.get();
    if (this.user.get('name'))
      this.set('name', this.user.get('name'));
  },
  submit: function(){
    this.user.set({name: this.get('name')});
    this.user.save();
    this.blur();
  }
});

hs.users.views.PasswordForm = hs.views.Form.mixin(hs.views.mixins.Dialog).extend({
  appendTo: $('#top-bar .width'),
  template: 'passwordForm',
  focusSelector: '#top-bar .password',
  fields: [{
    'name': 'oldPassword',
    'type': 'password',
    'placeholder': 'Old Password'
  },{
    'name': 'newPassword',
    'type': 'password',
    'placeholder': 'New Password'
  }],
  render: function(){
    hs.views.Form.prototype.render.apply(this, arguments);
    this.user = hs.users.User.get();
  },
  submit: function(){
    hs.auth.changePassword(this.get('oldPassword'), this.get('newPassword'), function(worked){
      if (worked){
        hs.auth.setPassword(this.get('newPassword'));
        this.blur();
        this.clear();
      }else{
        this.showInvalid('oldPassword');
      }
    }, this);
  }
});
