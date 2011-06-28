
dep.require('hs.views.View');
dep.require('hs.messages.views.Form');
dep.require('hs.messages.views.Message');

dep.provide('hs.messages.views.Conversation');
dep.provide('hs.messages.views.ConvoDialog');

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
    if (this.options.user) this.user = this.options.user;
  },

  render: function(){
    hs.views.View.prototype.render.apply(this, arguments);

    if (_.isUndefined(this.model)){
      this.getModel();
      hs.auth.bind('change:isAuthenticated', function(isAuth){
        this.getModel();
      }, this);
    }else{
      this.setupForm();
    }
  },

  getModel: function(clbk, context){
    this.listing.getConvoForUser(function(convo){
      if (convo && (_.isUndefined(this.model) || convo._id != this.model._id)){
        if (this.model)
          this.unbindModelEvents();
        this.model = convo;
        this.bindModelEvents();
        this.unrenderMessages();
        this.renderMessages();
      }else if (_.isUndefined(convo)){
        this.model = new hs.messages.Conversation();
        this.model.set({listing: this.listing});
        this.bindModelEvents();
        this.unrenderMessages();
      }

      this.setupForm();

      if (clbk) clbk.call(context);
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

  renderMessages: function(){
    if (!this.rendered || _.isUndefined(this.model)) return;

    this.messageViews = this.messageViews || {};

    var messages = this.model.get('messages');
    messages.sort();

    messages.each(function(message){
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
    $('#liConvo-'+this.model._id).addClass('selected');
  },

  blur: function(){
    hs.views.mixins.Dialog.blur.apply(this, arguments);
    $('#liConvo-'+this.model._id).removeClass('selected');
  }

});
