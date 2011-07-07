
dep.require('hs.views.View');
dep.require('hs.messages.views');
dep.require('hs.messages.views.Conversation');

dep.provide('hs.messages.views.LIConvo');

hs.messages.views.LIConvo = hs.views.View.extend({
  template: 'liConvo',

  modelEvents: {
    'change:creator': 'creatorChange',
    'change:created': 'createdChange',
    'change:messages': 'messagesChange'
  },

  creatorChange: function(){
    this.model.withField('creator', function(creator){

      this.$('.user').remove();

      new hs.users.views.InlineUser({
        prependTo: this.$('.liConvoData'),
        model: creator
      }).render();

      this.$('.offer').text('$0');
      this.model.withField('listing', function(listing){
        listing.withField('offers', function(offers){
          offers.each(function(offer){
            offer.withField('creator', function(offerCreator){
              if (creator._id == offerCreator._id)
                this.$('.offer').text('$'+offer.get('amount'));
            }, this);
          }, this);
        }, this);
      }, this);

    }, this);
  },

  messagesChange: function(){
    var messages = this.model.get('messages').length;

    if (this.$('.messagesCount').length == 0)
      this.$('.actions').prepend('<a href="javascript:;" class="messagesCount">'
          +messages+' Messages</a> | '
          +'<a href="javascript:;">Send a Message</a>');
    else
      this.$('.messagesCount').text(messages+' Messages');

    this.messages = this.messages || new hs.messages.views.ConvoDialog({
      focusSelector: '#liConvo-'+this.model._id,
      appendTo: this.el,
      user: this.model.get('creator'),
      listing: this.model.get('listing')
    });

    var oldColor = this.el.css('backgroundColor');
    this.el.animate({backgroundColor: '#fffaaf'}, 250, function(){
      $(this).animate({backgroundColor: oldColor}, 250, function(){
        $(this).attr('style', '');
      });
    });
  },

  createdChange: function(){
    var since = _.since(this.model.get('created'));
    this.$('.created').text(since.num+' '+since.text);
  },

  lock: function(){
    this.locked = true;
  },

  unlock: function(){
    this.locked = false;
  }
});
