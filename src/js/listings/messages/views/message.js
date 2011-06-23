//depends: core/views/view.js,
//         listings/messages/views/main.js

hs.messages.views.Message = hs.views.View.extend({
  template: 'message',
  modelEvents: {
    'change:message': 'messageChange',
    'change:creator': 'creatorChange',
    'change:created': 'createdChange'
  },

  creatorChange: function(){
    this.creator = this.model.get('creator');

    if (this.creator && _.isUndefined(this.creatorView)){
      this.creatorView = new hs.users.views.User({
        prependTo: this.el,
        model: this.creator
      });
      this.creatorView.render();
    }
  },

  messageChange: function(){
    this.$('.messageBody').text(this.model.get('message'));
  },

  createdChange: function(){
    var since = _.since(this.model.get('created'));
    this.$('.created').text(since.num+' '+since.text);
  }
});
