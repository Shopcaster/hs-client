//depends:
// core/views/page.js,
// core/views/authForm.js,
// users/views/user.js,
// listings/models.js,
// listings/views/main.js,
// listings/messages/views/convoList.js,
// listings/messages/views/convo.js,
// listings/inquiries/views/list.js

hs.listings.views.Listing = hs.views.Page.extend({
  template: 'listingPage',

  modelEvents: {
    'change:creator': 'updateCreator',
    'change:photo': 'updatePhoto',
    'change:description': 'updateDesc',
    'change:created': 'updateCreated',
    'change:modified': 'updateCreated',
    'change:latitude': 'updateLoc',
    'change:longitude': 'updateLoc',
    'change:price': 'updatePrice',
    'change:offers': 'updateBestOffer',
    'change:accepted': 'updateAccepted',
    'change:sold': 'updateSold'
  },

  render: function(){
    hs.views.Page.prototype.render.apply(this, arguments);

    this.inquiries = new hs.inquiries.views.Inquiries({
      appendTo: $('#listing-inquiries'),
      model: this.model
    });
    this.inquiries.render();

    this.$('.twitter').html('<a href="http://twitter.com/share" '
        +'class="twitter-share-button" data-text="'
          +'Check out this awesome item for sale on Hipsell. '
          +'Snap it up before it\'s too late.'
        +'" data-count="horizontal" data-via="hipsellapp">Tweet</a>'
        +'<script src="http://platform.twitter.com/widgets.js"></script>');

    if (Modernizr.geolocation)
      navigator.geolocation.getCurrentPosition(_.bind(this.updateLocation, this));
  },

  updateCreator: function(){
    this.creator = this.model.get('creator');

    if (this.creator && _.isUndefined(this.creatorView)){
      this.creatorView = new hs.users.views.User({
        el: this.$('#listing-creator'),
        model: this.creator
      });
      this.creatorView.render();
    }

    if (this.creator
        && hs.auth.isAuthenticated()
        && this.creator._id == hs.users.User.get()._id
        && _.isUndefined(this.convoList)){

      if (this.convo) this.convo.remove();

      this.convoList = new hs.messages.views.ConvoList({
        appendTo: $('#listing-messages'),
        model: this.model
      });
      this.convoList.render();

    }else if (this.creator && _.isUndefined(this.convo)){

      if (this.convoList) this.convoList.remove();

      this.convo = new hs.messages.views.Conversation({
        appendTo: $('#listing-messages'),
        listing: this.model
      });
      this.convo.render();
    }
  },

  updatePhoto: function(){
    if (this.model.get('photo')){
      this.$('#listing-image img')
            .attr('src', 'http://' + conf.server.host + ':' + conf.server.port +
                          '/static/' + this.model.get('photo'));

    }else{
      this.$('#listing-image img')
          .attr('src', 'http://lorempixum.com/560/418/technics/');
    }
  },

  updateDesc: function(){
    if (this.model.get('description')){
      this.$('#listing-description').text(this.model.get('description'));
    }
  },

  updateCreated: function(){
    if (this.model.get('created')){
      var since = _.since(this.model.get('created'));
      this.$('.date .listing-obi-title').text(since.text);
      this.$('.date .listing-obi-value').text(since.num);
    }
  },

  updateLoc: function(){
    if (this.model.get('latitude') && this.model.get('longitude')){
      var lat = this.model.get('latitude'),
        lng = this.model.get('longitude');
      this.$('img.map').attr('src', 'http://maps.google.com/'
          +'maps/api/staticmap?center='+lat+','+lng
          +'&zoom=14&size=340x100&sensor=false');
      this.$('.mapLink').attr('href', 'http://maps.google.com/?'
          +'ll='+lat+','+lng+'&z=16')
    }
  },

  updateLocation: function(position){
    var listingLoc = new LatLon(this.model.get('latitude'), this.model.get('longitude'));
    var userLoc = new LatLon(position.coords.latitude, position.coords.longitude);

    var dist = parseFloat(userLoc.distanceTo(listingLoc));
    var brng = userLoc.bearingTo(listingLoc);

    var direction = _.degreesToDirection(brng);

    var distStr;
    if (dist < 1)
      distStr = Math.round(dist*1000)+' metres'
    else
      distStr = Math.round(dist*100)/100+' km'

    this.$('#listing-locDiff').text(distStr+' '+direction+' of you.');
  },

  updatePrice: function(){
    if (this.model.get('price')){
      this.$('.asking .listing-obi-value').text('$'+this.model.get('price'));
    }
  },

  updateBestOffer: function(){
    this.model.bestOffer(function(best){
      if (best){
        var node = this.$('.best-offer .listing-obi-value');

        node.text('$'+best.get('amount'));

        node.animate({color: '#828200'}, 250, function(){
          node.animate({color: '#5E5E5E'}, 250);
        });
      }

    }, this);
  },

  updateSold: function(){
    if (this.model.get('sold')){
      this.$('.status').removeClass('accepted').addClass('sold').text('Sold');
    }
  },

  updateAccepted: function(){
    var accepted = this.model.get('accepted');
    if (accepted){
      this.$('.status').removeClass('sold').addClass('accepted').text('Offer Accepted');
      this.accepted = true;
      this.offers.disable(accepted);
      this.inquiries.disable();
    }else if (this.accepted){
      this.$('.status').hide();
      this.accepted = false;
      this.offers.enable();
      this.inquiries.enable();
    }
  }
});
