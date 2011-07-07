
dep.require('hs.views.View');
dep.require('hs.messages.views.Form');
dep.require('hs.messages.views.Message');

dep.provide('hs.messages.views.Conversation');
dep.provide('hs.messages.views.ConvoDialog');

hs.messages.views.Conversation = hs.views.View.extend({
  template: 'conversation',
  
  events: {
    'click .message .pub': 'answer'
  },

  modelEvents: {
    'add:messages': 'addMessage',
    'remove:messages': 'removeMessages'
  },

  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
    if (this.options.listing) this.listing = this.options.listing;
    if (this.options.user) this.user = this.options.user;

    this.getModel();
    hs.auth.bind('change:isAuthenticated', this.getModel, this);
  },

  render: function(){
    hs.views.View.prototype.render.apply(this, arguments);

    if (!_.isUndefined(this.model)){
      this.setupForm();
      this.renderMessages();
    }
  },

  getModel: function(clbk, context){
    this.listing.getConvoForUser(this.user, function(convo){
      if (!_.isUndefined(this.model) && (_.isUndefined(convo) || convo._id != this.model._id)){

        this.unbindModelEvents();

        if (this.rendered)
          this.unrenderMessages();
      }

      if (convo && (_.isUndefined(this.model) || convo._id != this.model._id)){
        this.model = convo;
        this.bindModelEvents();

      }else if (_.isUndefined(convo)){
        this.model = new hs.messages.Conversation();
        this.model.set({listing: this.listing});
        this.bindModelEvents();
      }

      if (this.rendered){
        this.setupForm();
        this.renderMessages();
      }

      if (_.isFunction(clbk)) clbk.call(context);
    }, this);
  },

  setupForm: function(){
    if (this.form){
      this.form.convo = this.model;
    }else{
      this.form = new hs.messages.views.Form({
        appendTo: this.$('.messageForm'),
        convo: this.model
      });
      this.form.render();
    }
  },

  unrenderMessages: function(){
    _.each(this.messageViews, function(view){
      view.remove();
    }, this);
  },

  addMessage: function(message){
    if (message && !_.isUndefined(this.messageViews[message._id])) return;

    this.messageViews[message._id] = new hs.messages.views.Message({
      prependTo: this.$('.messageList'),
      model: message
    });
    this.messageViews[message._id].render();
  },

  renderMessages: function(){
    if (!this.rendered || _.isUndefined(this.model)) return;
    hs.log('renderMessages');

    this.model.withField('messages', function(){

      this.messageViews = {};
      this.$('.messageList').html('');

      var messages = this.model.get('messages');
      messages.sort();

      messages.each(function(message){
        this.messageViews[message._id] = new hs.messages.views.Message({
          prependTo: this.$('.messageList'),
          model: message
        });
        this.messageViews[message._id].render();
      }, this);

    }, this);
  },

  removeMessages: function(){
    hs.log('remove message doesn\'t work');
    //noop
  },

  answer: function(e){
    var message = hs.messages.Message.get($(e.target).attr('data-message'));
    this.form.answerPublicly(message);
  }

});


hs.messages.views.ConvoDialog = hs.messages.views.Conversation.mixin(hs.views.mixins.Dialog).extend({

  focus: function(e){
    if ($(e.target).is('.dontOpen')) return;
    hs.views.mixins.Dialog.focus.apply(this, arguments);
    this.$('input.messageField').focus();
    $('#liConvo-'+this.model._id).addClass('selected');
  },

  blur: function(){
    hs.views.mixins.Dialog.blur.apply(this, arguments);
    $('#liConvo-'+this.model._id).removeClass('selected');
  }

});
