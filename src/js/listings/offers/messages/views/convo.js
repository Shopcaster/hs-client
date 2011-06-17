//depends: core/views/view.js,
//         listings/offers/messages/views/main.js,
//         listings/offers/messages/views/form.js,
//         listings/offers/messages/views/message.js

hs.messages.views.Conversation = hs.views.View.mixin(hs.views.mixins.Dialog).extend({
  template: 'conversation',
  modelEvents: {
    'change:messages': 'renderMessages',
    'add:messages': 'renderMessages',
    'remove:messages': 'removeMessages'
  },
  render: function(){
    this._tmplContext.messages = this.model.get('messages').toJSON();
    hs.views.View.prototype.render.apply(this, arguments);
    this.form = new hs.messages.views.Form({
      appendTo: this.$('.messageForm'),
      offer: this.model
    });
    this.form.render();
    this.renderMessages();
  },
  messageViews: {},
  renderMessages: function(){
    if (!this.rendered) return;
    this.model.get('messages').each(function(message){
      if (_.isUndefined(this.messageViews[message._id])){
        this.messageViews[message._id] = new hs.messages.views.Message({
          prependTo: this.$('.messageList'),
          model: message
        });
      }
      if (!this.messageViews[message._id].rendered)
        this.messageViews[message._id].render();
    }, this);
  },
  removeMessages: function(){
    hs.log('remove message doesn\'t work');
    //noop
  },
  focus: function(e){
    if ($(e.target).is('.dontOpen')) return;
    hs.views.mixins.Dialog.focus.apply(this, arguments);
    this.$('input.messageField').focus();
    $('#offer-'+this.model._id).addClass('selected');
  },
  blur: function(){
    hs.views.mixins.Dialog.blur.apply(this, arguments);
    $('#offer-'+this.model._id).removeClass('selected');
  }
});
