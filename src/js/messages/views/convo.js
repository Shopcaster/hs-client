//depends: core/views/view.js,
//         messages/views/main.js,
//         messages/views/form.js,
//         messages/views/message.js

hs.messages.views.Conversation = hs.views.View.mixin(hs.views.mixins.Dialog).extend({
  template: 'conversation',
  modelEvents: {
    'change:messages': 'renderMessages'
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
    var newMessages = this.model.get('messages');
    var newMessageIds = [];
    // add new messages
    newMessages.each(function(message, i){
      newMessageIds.push(message._id);
      if (_.isUndefined(this.messageViews[message._id])){
        this.messageViews[message._id] = new hs.messages.views.Message({
          appendTo: this.$('.messageList'),
          model: message
        });
      }
    }, this);
    // remove old messages
    _.each(_.keys(this.messageViews), function(id){
      if (!_.include(newMessageIds, id))
        delete this.messageViews[id];
    }, this);
    // render messages
    _.each(this.messageViews, function(view){
      if (!view.rendered) view.render();
    }, this);
  },
  focus: function(){
    hs.views.mixins.Dialog.focus.apply(this, arguments);
    this.$('input.messageField').focus();
    $('#offer-'+this.model._id+' .offerData').addClass('selected');
  },
  blur: function(){
    hs.views.mixins.Dialog.blur.apply(this, arguments);
    $('#offer-'+this.model._id+' .offerData').removeClass('selected');
  }
});
