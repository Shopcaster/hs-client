//depends: core/views/view.js,
//         listings/messages/views/main.js,
//         listings/messages/views/form.js,
//         listings/messages/views/message.js

hs.messages.views.Conversation = hs.views.View.extend({
  template: 'conversation',
  modelEvents: {
    'change:messages': 'renderMessages',
    'add:messages': 'renderMessages',
    'remove:messages': 'removeMessages'
  },
  render: function(){
    hs.views.View.prototype.render.apply(this, arguments);
    this.form = new hs.messages.views.Form({
      appendTo: this.$('.messageForm'),
      offer: this.model
    });
    this.form.render();
    this.renderMessages();
  },
  renderMessages: function(){
    if (!this.rendered) return;

    this.messageViews = this.messageViews || {};

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
  }
});


hs.messages.views.ConvoDialog = hs.messages.views.Conversation.mixin(hs.views.mixins.Dialog).extend({
  focus: function(e){
    if ($(e.target).is('.dontOpen')) return;
    hs.views.mixins.Dialog.focus.apply(this, arguments);
    this.$('input.messageField').focus();
    $('#convo-'+this.model._id).addClass('selected');
  },
  blur: function(){
    hs.views.mixins.Dialog.blur.apply(this, arguments);
    $('#convo-'+this.model._id).removeClass('selected');
  }
});
