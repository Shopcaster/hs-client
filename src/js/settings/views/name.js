
dep.require('hs.views.Page');
dep.require('hs.views.Form');
dep.require('hs.settings.views');
dep.provide('hs.settings.views.Name');
dep.provide('hs.settings.views.NameForm');

hs.settings.views.Name = hs.views.Page.extend({
  template: 'name',
  initialize: function(){
    hs.views.Page.prototype.initialize.apply(this, arguments);
    
  },
  render: function(){
    hs.views.Page.prototype.render.apply(this, arguments);
    this.form = new hs.settings.views.NameForm({
      appendTo: $('#name-form')
    });
    this.form.render();
  }
});

hs.settings.views.NameForm = hs.views.Form.extend({
  template: 'nameForm',
  fields: [{
      'name': 'name',
      'type': 'text',
      'placeholder': 'Public Name'
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
  }
});
