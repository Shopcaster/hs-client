
dep.require('hs.views.mixins');
dep.provide('hs.views.mixind.Dialog');

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
    this.blur = _.bind(this.blur, this);
  },
  dialogRender: function(){
    this.el.addClass('dialog');
    this.dialogSetBlur();
  },
  dialogSetMousedown: function(){
    $(this.focusSelector)
      .one('mousedown', _.bind(this.focus, this))
      .click(function(e){e.preventDefault()});
  },
  dialogSetBlur: function(){
    $('body').click(this.blur);
    this.el.click(function(e){e.stopPropagation()});
    $(this.focusSelector).click(function(e){e.stopPropagation()});
  },
  focus: function(){
    this.blurAllElse();
    if (!this.rendered) this.render();
    this.el.addClass('open').show();
    this.el.show();
  },
  blur: function(){
    this.el.hide().removeClass('open');
    this.dialogSetMousedown();
  },
  blurAllElse: function(){
    $('body')
        .unbind('click', this.blur)
        .click()
        .bind('click', this.blur);
  }
};
