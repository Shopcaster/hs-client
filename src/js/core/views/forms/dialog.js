//depends: auth/views.js

hs.views.AuthFormDialog = hs.auth.views.AuthForm.extend({
  focusFieldName: 'main',
  initialize: function(opts){
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
    $('input[name='+this.focusFieldName+']').bind('mousedown', _.bind(function(e){
      e.preventDefault();
      e.stopPropagation();
      this.focus();
    }, this));
  },
  render: function(){
    hs.auth.views.AuthForm.prototype.render.apply(this, arguments);
    $('body').click(_.bind(this.blur, this));
    this.el.click(function(e){e.stopPropagation()});
  },
  focus: function(){
    if (!this.rendered) this.render();
    this.el.addClass('open').fadeIn(200);
    this.el.show();
  },
  blur: function(){
    this.el.fadeOut(200).removeClass('open');
    this.el.hide();
  }
});
