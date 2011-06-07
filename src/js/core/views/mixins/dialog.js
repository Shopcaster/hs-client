//depends: core/views/mixins/main.js

hs.views.mixins.Dialog = {
  events: {
    'initialized': 'dialogInitialize',
    'rendered': 'dialogRender'
  },
  dialogInitialize: function(){
    this.focusSelector = this.options.focusSelector || this.focusSelector;
    if (_.isUndefined(this.focusSelector))
      throw(new Error('this.focusSelector must be defined for hs.views.mixins.Dialog mixin.'));
    this.dialogSetMousedown();
  },
  dialogRender: function(){
    this.dialogSetBlur();
  },
  dialogSetMousedown: function(){
    $(this.focusSelector).one('mousedown', _.bind(this.focus, this));
    $(this.focusSelector).click(function(e){
      e.preventDefault();
    });
  },
  dialogSetBlur: function(){
    $('body').click(_.bind(this.blur, this));
    this.el.click(function(e){
      e.stopPropagation()});
    $(this.focusSelector).click(function(e){
      e.stopPropagation()});
  },
  focus: function(){
    if (!this.rendered) this.render();
    this.el.addClass('open').fadeIn(200);
    this.el.show();
  },
  blur: function(){
    this.el.fadeOut(200).removeClass('open');
    this.el.hide();
    this.dialogSetMousedown();
  }
};
