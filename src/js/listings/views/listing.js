(function() {
  /*
  depends:
   core/views/page.js,
   core/views/authForm.js,
   users/views/user.js,
   listings/models.js,
   listings/views/main.js,
   listings/messages/views/convoList.js,
   listings/messages/views/convo.js,
   listings/inquiries/views/list.js
  */  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
    render: function() {
      hs.views.Page.prototype.render.apply(this, arguments);
      hs.auth.bind('change:isAuthenticated', this.updateCreator, this);
      this.inquiries = new hs.inquiries.views.Inquiries({
        appendTo: $('#listing-inquiries'),
        model: this.model
      });
      this.inquiries.render();
      this.$('.twitter').html('\
      <a href="http://twitter.com/share"\
         class="twitter-share-button"\
         data-count="horizontal"\
         data-via="hipsellapp"\
         data-text="Check out this awesome item for sale on Hipsell. Snap it up before it\'s too late.">\
          Tweet\
      </a>\
      <script src="http://platform.twitter.com/widgets.js"></script>');
      if (Modernizr.geolocation) {
        return navigator.geolocation.getCurrentPosition(_.bind(this.updateLocation, this));
      }
    },
    updateCreator: function() {
      this.creator = this.model.get('creator');
      if ((this.creator != null) && !(this.creatorView != null)) {
        this.creatorView = new hs.users.views.User({
          el: this.$('#listing-creator'),
          model: this.creator
        });
        this.creatorView.render();
      }
      if ((this.creator != null) && hs.auth.isAuthenticated() && this.creator._id === hs.users.User.get()._id && !(this.convoList != null)) {
        if (this.convo != null) {
          this.convo.remove();
          this.convo = null;
        }
        this.convoList = new hs.messages.views.ConvoList({
          appendTo: $('#listing-messages'),
          model: this.model
        });
        return this.convoList.render();
      } else if (!(this.convo != null)) {
        if (this.convoList != null) {
          this.convoList.remove();
          this.convoList = null;
        }
        this.convo = new hs.messages.views.Conversation({
          appendTo: $('#listing-messages'),
          listing: this.model
        });
        return this.convo.render();
      }
    },
    updatePhoto: function() {
      if (this.model.get('photo') != null) {
        return this.$('#listing-image img').attr('src', "http://" + conf.server.host + ":" + conf.server.port + "/static/" + (this.model.get('photo')));
      }
    },
    updateDesc: function() {
      if (this.model.get('description') != null) {
        this.$('#listing-description').text(this.model.get('description'));
        return $('title').text('Hipsell - ' + this.model.get('description'));
      }
    },
    updateCreated: function() {
      var since;
      if (this.model.get('created') != null) {
        since = _.since(this.model.get('created'));
        this.$('.date .listing-obi-title').text(since.text);
        return this.$('.date .listing-obi-value').text(since.num);
      }
    },
    updateLoc: function() {
      var lat, lng;
      if ((this.model.get('latitude') != null) && (this.model.get('longitude') != null)) {
        lat = this.model.get('latitude');
        lng = this.model.get('longitude');
        this.$('img.map').attr('src', "http://maps.google.com/maps/api/staticmap?center=" + lat + "," + lng + "&zoom=14&size=340x100&sensor=false");
        return this.$('.mapLink').attr('href', "http://maps.google.com/?ll=" + lat + "," + lng + "&z=16");
      }
    },
    updateLocation: function(position) {
      var brng, direction, dist, distStr, listingLoc, userLoc;
      listingLoc = new LatLon(this.model.get('latitude'), this.model.get('longitude'));
      userLoc = new LatLon(position.coords.latitude, position.coords.longitude);
      dist = parseFloat(userLoc.distanceTo(listingLoc));
      brng = userLoc.bearingTo(listingLoc);
      direction = _.degreesToDirection(brng);
      if (dist < 1) {
        distStr = Math.round(dist * 1000) + ' metres';
      } else {
        distStr = Math.round(dist * 100) / 100 + ' km';
      }
      return this.$('#listing-locDiff').text("Roughly " + distStr + " " + direction + " of you.");
    },
    updatePrice: function() {
      if (this.model.get('price') != null) {
        return this.$('.asking .listing-obi-value').text('$' + this.model.get('price'));
      }
    },
    updateBestOffer: function() {
      return this.model.bestOffer(__bind(function(best) {
        var node;
        if (best) {
          node = this.$('.best-offer .listing-obi-value');
          node.text('$' + best.get('amount'));
          return node.animate({
            color: '#828200'
          }, 250, function() {
            return node.animate({
              color: '#5E5E5E'
            }, 250);
          });
        }
      }, this));
    },
    updateSold: function() {
      if (this.model.get('sold')) {
        return this.$('.status').removeClass('accepted').addClass('sold').text('Sold');
      }
    },
    updateAccepted: function() {
      var accepted;
      accepted = this.model.get('accepted');
      if (accepted != null) {
        this.$('.status').removeClass('sold').addClass('accepted').text('Offer Accepted');
        this.accepted = true;
        this.offers.disable(accepted);
        return this.inquiries.disable();
      } else if (this.accepted != null) {
        this.$('.status').hide();
        this.accepted = false;
        this.offers.enable();
        return this.inquiries.enable();
      }
    }
  });
}).call(this);
