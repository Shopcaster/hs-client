
dep.require('hs.views.View');
dep.require('hs.inquiries.views');

dep.provide('hs.inquiries.views.Inquiry');

hs.inquiries.views.Inquiry = hs.views.View.extend({
  template: 'inquiry',
  modelEvents: {
    'change:question': 'questionChange',
    'change:answer': 'answerChange',
    // 'change:creator': 'creatorChange',
    // 'change:created': 'createdChange'
  },

  creatorChange: function(){
    this.model.withField('creator', function(creator){
      if (_.isUndefined(this.creatorView)){
        this.creatorView = new hs.users.views.InlineUser({
          prependTo: this.el,
          model: creator
        });
        this.creatorView.render();
      }
    }, this);
  },

  questionChange: function(){
    this.$('.question').text('Q: '+this.model.get('question'));
  },

  answerChange: function(){
    this.$('.answer').text('A: '+this.model.get('answer'));
  },

  createdChange: function(){
    var since = _.since(this.model.get('created'));
    this.$('.created').text(since.num+' '+since.text);
  },

  remove: function(){
    $('#inquiry-'+this.model._id).remove();
    this.trigger('removed');
  }
});
