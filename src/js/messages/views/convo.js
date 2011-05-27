//depends: core/views/main.js,
//         messages/views/main.js,
//         messages/views/form.js,
//         messages/views/message.js

hs.messages.views.Conversation = hs.views.View.extend({
  template: 'conversation',
  modelEvents: {
    'change:messages': 'messagesChange'
  },
  render: function(){
    this._tmplContext.messages = this.model.get('messages').toJSON();
    hs.views.View.prototype.render.apply(this, arguments);
    this.form = this.form || new hs.messages.views.Form({
      appendTo: this.$('#messageForm'),
      offer: this.model
    });
    this.renderMessages();
  },
  messageViews: new Object(),
  renderMessages: function(){
    var newMessages = this.model.get('messages');
    var newMessageIds = [];
    // add new messages
    _.each(newMessages, _.bind(function(o, i){
      var message = newMessages.at(i);
      newMessageIds.push(message.id);
      if (_.isUndefined(this.messageViews[message.id])){
        this.messageViews[message.id] = new hs.messages.views.Message({
          appendTo: $('#messageList'),
          model: message
        });
      }
    }, this));
    // remove old messages
    _.each(_.keys(this.messageViews), _.bind(function(id){
      id = parseInt(id);
      if (!_.include(newMessageIds, id))
        delete this.messageViews[id];
    }, this));
    // render messages
    _.each(this.messageViews, _.bind(function(view){
      if (!view.rendered) view.render();
    }, this));
  },
  messagesChange: function(){
    this.renderMessages();
  }
});
