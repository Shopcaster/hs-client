//depends: main.js, auth/tmpl/settingsForm.tmpl, core/views/forms/main.js,
//         auth/main.js

hs.auth.SettingsForm = hs.views.Form.extend({
  appendTo: $('#top-bar .width'),
  template: 'settingsForm',
  fields: [{
    'name': 'name',
    'type': 'text',
    'placeholder': 'Name'
  }],
  initialize: function(){
    hs.views.Form.prototype.initialize.apply(this, arguments);
    this.user = hs.auth.getUser();
  },
  render: function(){
    hs.views.View.prototype.render.apply(this, arguments);
    if (this.user.get('name'))
      this.set('name', this.user.get('name'));
    $('body').click(_.bind(this.hide, this));
    $('#settingsForm').click(function(e){e.stopPropagation()});
  },
  submit: function(){
    this.user.set({name: this.get('name')});
    this.user.save();
    this.hide();
  },
  show: function(){
    if (!this.rendered) this.render();
    $('#settingsForm').fadeIn(200);
    $('a.name').addClass('open');
  },
  hide: function(){
    $('#settingsForm').fadeOut(200);
    $('a.name').removeClass('open');
  },
  toggle: function(){
    if($('#settingsForm:visible').length)
      this.hide();
    else
      this.show();
  }
});
