
dep.require('hs.views.View');
dep.require('hs.messages.views');
dep.require('hs.messages.views.LIConvo');

dep.provide('hs.messages.views.ConvoList');

hs.messages.views.ConvoList = hs.views.View.extend({
  template: 'convoList',
  modelEvents: {
    'change:convos': 'convosChange',
    'add:convos': 'convosAdd',
    'remove:convos': 'convosRemove'
  },

  render: function(){
    hs.views.View.prototype.render.apply(this, arguments);
    this.renderConvos();
  },

  renderConvos: function(){
    this.convoViews = this.convoViews || {};

    this.model.get('convos').each(function(convo){

      if (_.isUndefined(this.convoViews[convo._id])){
        this.convoViews[convo._id] = new hs.messages.views.LIConvo({
          appendTo: $('#convoList'),
          model: convo,
          listing: this.model
        });
      }

      if (!this.convoViews[convo._id].rendered)
        this.convoViews[convo._id].render();

      if (this.disabled){
        this.convoViews[convo._id].lock();
        if (this.acceptedMessage._id == convo._id)
          this.convoViews[convo._id].accepted();
      }

    }, this);
  },

  convosChange: function(){
    this.renderConvos();
  },

  convosAdd: function(){
    this.renderConvos();
  },

  convosRemove: function(convos){
    _.each(convos, function(convo){
      if (!_.isUndefined(this.convoViews[convo._id])){
        this.convoViews[convo._id].remove();
        delete this.convoViews[convo._id];
      }
    }, this);
  },

  disable: function(){
    this.disabled = true;
    _.each(this.convoViews, function(view, id){
      view.lock();
    });
  },

  enable: function(){
    this.disabled = false;
    _.each(this.convoViews, function(view){
      view.unlock();
    });
  }
});
