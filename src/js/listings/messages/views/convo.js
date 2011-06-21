//depends:
// core/views/view.js,
// listings/messages/views/main.js,
// listings/messages/views/form.js,
// listings/messages/views/message.js

hs.messages.views.Conversation = hs.views.View.extend({
  template: 'conversation',
  modelEvents: {
    'change:messages': 'renderMessages',
    'add:messages': 'renderMessages',
    'remove:messages': 'removeMessages'
  },

  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
    if (this.options.listing) this.listing = this.options.listing;
  },

  render: function(){

    if (_.isUndefined(this.model)){
      this.model = new hs.messages.Conversation();
      if (!_.isUndefined(this.listing)
          && hs.auth.isAuthenticated()){
        this.getModel();
      }else if (!_.isUndefined(this.listing)){
        hs.auth.bind('change:isAuthenticated', function(isAuth){
          if (isAuth) this.getModel();
        }, this);
      }
    }

    hs.views.View.prototype.render.apply(this, arguments);

    this.form = new hs.messages.views.Form({
      appendTo: this.$('.messageForm'),
      convo: this.model
    });
    this.form.render();
    this.renderMessages();
  },

  getModel: function(){
    this.listing.getConvoForUser(function(convo){
      hs.log('getConvoForUser', convo)
      if (convo){
        this.model = convo;
        this.form.convo = this.model;
      }
    }, this);
  },

  renderMessages: function(){
    if (!this.rendered || _.isUndefined(this.model)) return;

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
