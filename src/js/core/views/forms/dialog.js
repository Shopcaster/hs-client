//depends: auth/views.js

hs.views.mixins = hs.views.mixins || new Object();

hs.views.mixins.Dialog = {
  events: {
    'initialized': 'setMousedown',
    'rendered': 'setPropagation'
  },
  focusFieldName: '',
  setMousedown: function(){
    $('input[name='+this.focusFieldName+']').bind('mousedown', _.bind(function(e){
      e.preventDefault();
      e.stopPropagation();
      this.focus();
    }, this));
  },
  setPropagation: function(){
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
};
