(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
    render: function() {
      hs.views.View.prototype.render.apply(this, arguments);
      return this.renderConvos();
    },
    renderConvos: function() {
      this.convoViews || (this.convoViews = {});
      return this.model.withField('convos', __bind(function() {
        return this.model.get('convos').each(__bind(function(convo) {
          if (!(this.convoViews[convo._id] != null)) {
            this.convoViews[convo._id] = new hs.messages.views.LIConvo({
              appendTo: $('.convoList'),
              model: convo,
              listing: this.model
            });
          }
          if (!this.convoViews[convo._id].rendered) {
            this.convoViews[convo._id].render();
          }
          if (this.disabled) {
            this.convoViews[convo._id].lock();
            if (this.acceptedMessage._id === convo._id) {
              return this.convoViews[convo._id].accepted();
            }
          }
        }, this));
      }, this));
    },
    convosChange: function() {
      return this.renderConvos();
    },
    convosAdd: function() {
      return this.renderConvos();
    },
    convosRemove: function(convos) {
      return _.each(convos, __bind(function(convo) {
        if (!_.isUndefined(this.convoViews[convo._id])) {
          this.convoViews[convo._id].remove();
          return delete this.convoViews[convo._id];
        }
      }, this));
    },
    disable: function() {
      this.disabled = true;
      return _.each(this.convoViews, function(view, id) {
        return view.lock();
      });
    },
    enable: function() {
      this.disabled = false;
      return _.each(this.convoViews, function(view) {
        return view.unlock();
      });
    }
  });
}).call(this);
