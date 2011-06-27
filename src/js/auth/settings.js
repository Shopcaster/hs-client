
dep.require('hs.views.Form');
dep.require('hs.auth');
dep.require('hs.views.mixins.Dialog');

dep.provide('hs.auth.Settings');
dep.provide('hs.auth.NameForm');
dep.provide('hs.auth.PasswordForm');

hs.auth.Settings = hs.views.View.mixin(hs.views.mixins.Dialog).extend({
  appendTo: $('#top-bar .width'),
  template: 'settings',
  focusSelector: '#top-bar .settings',
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
    this.nameForm = new hs.auth.NameForm();
    this.passwordForm = new hs.auth.PasswordForm();
  },
  focus: function(){
    hs.views.mixins.Dialog.focus.apply(this, arguments);
    this.nameForm.dialogSetMousedown();
    this.passwordForm.dialogSetMousedown();
  }
});

hs.auth.NameForm = hs.views.Form.mixin(hs.views.mixins.Dialog).extend({
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
    this.user = this.user || hs.auth.getUser();
    if (this.user.get('name'))
      this.set('name', this.user.get('name'));
  },
  submit: function(){
    this.user.set({name: this.get('name')});
    this.user.save();
    this.blur();
  }
});

hs.auth.PasswordForm = hs.views.Form.mixin(hs.views.mixins.Dialog).extend({
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
    this.user = hs.auth.getUser();
  },
  submit: function(){
    hs.auth.changePassword(this.get('oldPassword'), this.get('newPassword'), _.bind(function(worked){
      if (worked){
        hs.auth.setPassword(this.get('newPassword'));
        this.blur();
        this.clear();
      }else{
        this.showInvalid('oldPassword');
      }
    }, this));
  }
});
