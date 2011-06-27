
dep.require('hs.con');
dep.require('hs.init');
dep.require('hs.views.View');

hs.nots = {
  init: function(){
    hs.con.bind('not', this.recieved);
  },
  recieved: function(data){
    this.send(data.message, data.key);
  },
  send: function(message, key){
    var notView = new hs.nots.Notification({message: message, key: key});
    notView.render();
    setTimeout(function(){
      notView.remove();
      notView = null;
    }, 5000);
  }
}
_.bindAll(hs.nots);
// _.extend(hs.nots, Backbone.Events);

hs.init(hs.nots.init);

hs.nots.Notification = hs.views.View.extend({
  _configure: function(){
    hs.views.View.prototype._configure.apply(this, arguments);
    if (this.options.message) this.message = this.options.message;
    if (this.options.key) this.key = this.options.key;
  },
  render: function(){
    this.getListingLink(function(link){
      var htm = '<div class="notification">';
      htm += this.message;
      if (link) htm += ' <a href="'+link+'">Check it out.</a>';
      htm += '</div>';
      this.el = $(htm).hide()
      $('#notifications').append(this.el);
      this.el.fadeIn(200);
    });
  },
  getListingLink: function(clbk){
    if (_.isUndefined(this.key))
      return clbk.call(this);
    var key = this.key.split(':'),
        id = key[1],
        key = key[0],
        Model = null,
        rel = 'listing';

    switch(key){
      case 'offer':
        Model = hs.offers.Offer;
      break;
      case 'message':
        Model = hs.messages.Message;
        rel = 'offer.listing';
      break;
      case 'inquiry':
        Model = hs.inquiries.Inquiry;
      break;
    }

    var model = Model.get(id);
    model.withRel(rel, function(listing){
      clbk.call(this, '#!/listings/'+listing._id+'/');
    }, this);
  },
  remove: function(){
    this.el.fadeOut(200)
  }
});
