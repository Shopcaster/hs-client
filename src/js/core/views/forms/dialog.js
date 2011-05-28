//depends: auth/views.js

hs.views.mixins = hs.views.mixins || new Object();

hs.views.mixins.Dialog = {
  events: {
    'initialized': 'setMousedown',
    'rendered': 'setPropagation'
  },
  setMousedown: function(){
    this.focusSelector = this.options.focusSelector || this.focusSelector;
    if (_.isUndefined(this.focusSelector))
      throw(new Error('this.focusSelector must be defined for hs.views.mixins.Dialog mixin.'));
    $(this.focusSelector).bind('mousedown', _.bind(function(e){
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
