
dep.require('hs.views.mixins');
dep.provide('hs.views.mixins.Dialog');

hs.views.mixins.Dialog = {
  stop: function(e){e.stopPropagation()},
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
    $(this.focusSelector).one('mousedown', _.bind(function(){
      $(this.focusSelector).one('click', this.stop);
      this.focus.apply(this, arguments);
    }, this));
  },

  dialogSetBlur: function(){
    $('body').click(this.blur);
    this.el.click(this.stop);
  },

  focus: function(){
    this.blurAllElse();
    if (!this.rendered) this.render();
    this.el.addClass('open').show();
    this.el.show();
    $(this.focusSelector).addClass('open');
  },

  blur: function(){
    this.el.hide().removeClass('open');
    $(this.focusSelector).removeClass('open');
    this.dialogSetMousedown();
  },

  blurAllElse: function(){
    $('body')
        .unbind('click', this.blur)
        .click()
        .bind('click', this.blur);
  }
};
