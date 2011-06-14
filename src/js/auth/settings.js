//depends: main.js, core/views/forms/form.js, auth/main.js

hs.auth.SettingsForm = hs.views.Form.mixin(hs.views.mixins.Dialog).extend({
  appendTo: $('#top-bar .width'),
  template: 'settingsForm',
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
