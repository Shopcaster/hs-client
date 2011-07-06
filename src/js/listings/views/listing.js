(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  dep.require('hs.views.Page');
  dep.require('hs.listings.views');
  dep.require('hs.listings.Listing');
  dep.require('hs.users.views.User');
  dep.require('hs.inquiries.views.Inquiries');
  dep.require('hs.messages.views.ConvoList');
  dep.require('hs.messages.views.Conversation');
  dep.provide('hs.listings.views.Listing');
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
      'change:offers': 'updateOffers',
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
      this.$('.fb').html("      <iframe src=\"http://www.facebook.com/plugins/like.php?app_id=105236339569884&amp;href=http%3A%2F%2Fhipsell.com/#!/listings/" + this.model._id + "/&amp;href&amp;send=false&amp;layout=button_count&amp;width=150&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;height=30\" scrolling=\"no\" frameborder=\"0\" style=\"border:none; overflow:hidden; width:150px; height:30px;\" allowTransparency=\"true\"></iframe>");
      if (Modernizr.geolocation) {
        navigator.geolocation.getCurrentPosition(_.bind(this.updateLocation, this));
      }
      hs.setMeta('og:title', 'Listing at Hipsell');
      hs.setMeta('og:type', 'product');
      hs.setMeta('og:url', window.location.toString());
      hs.setMeta('og:site_name', 'Hipsell');
      return hs.setMeta('fb:app_id', '110693249023137');
    },
    updateAuth: function(clbk) {
      return hs.auth.ready(__bind(function() {
        var _ref;
        this.isAuthd = hs.auth.isAuthenticated();
        if (this.isAuthd) {
          this.isOwner = ((_ref = this.creator) != null ? _ref._id : void 0) === hs.users.User.get()._id;
        }
        if (this.isOwner) {
          this.el.addClass('owner');
        }
        return clbk();
      }, this));
    },
    updateCreator: function() {
      this.creator = this.model.get('creator');
      if (!(this.creator != null)) {
        return;
      }
      if (!(this.creatorView != null)) {
        this.creatorView = new hs.users.views.User({
          el: this.$('#listing-creator'),
          model: this.creator
        });
        this.creatorView.render();
      }
      return this.updateAuth(__bind(function() {
        if (this.isAuthd && this.isOwner && !(this.convoList != null)) {
          if (this.convo != null) {
            this.convo.remove();
            this.convo = null;
          }
          this.convoList = new hs.messages.views.ConvoList({
            appendTo: $('#listing-messages'),
            model: this.model
          });
          this.convoList.render();
        } else if (!this.isOwner && !(this.convo != null)) {
          if (this.convoList != null) {
            this.convoList.remove();
            this.convoList = null;
          }
          this.convo = new hs.messages.views.Conversation({
            appendTo: $('#listing-messages'),
            listing: this.model
          });
          this.convo.render();
        }
        if (!this.isOwner && !(this.offerForm != null)) {
          return this.offerForm = new hs.offers.views.Form({
            appendTo: this.$('.offerFormWrapper').show(),
            listing: this.model,
            focusSelector: '.offerButton'
          });
        }
      }, this));
    },
    updatePhoto: function() {
      var url;
      if (this.model.get('photo') != null) {
        url = "http://" + conf.server.host + ":" + conf.server.port + "/static/" + (this.model.get('photo'));
        this.$('#listing-image > img').attr('src', url);
        return hs.setMeta('og:image', url);
      }
    },
    updateDesc: function() {
      if (this.model.get('description') != null) {
        this.$('#listing-description').text(this.model.get('description'));
        $('title').text('Hipsell - ' + this.model.get('description'));
        return hs.setMeta('og:description', this.model.get('description'));
      }
    },
    updateCreated: function() {
      var since;
      if (this.model.get('created') != null) {
        since = _.since(this.model.get('created'));
        return this.$('.created').text("" + since.num + " " + since.text);
      }
    },
    updateLoc: function() {
      var lat, lng;
      if ((this.model.get('latitude') != null) && (this.model.get('longitude') != null)) {
        lat = this.model.get('latitude');
        lng = this.model.get('longitude');
        this.$('img.map').attr('src', "http://maps.google.com/maps/api/staticmap?center=" + lat + "," + lng + "&zoom=14&size=450x150&sensor=false");
        this.$('.mapLink').attr('href', "http://maps.google.com/?ll=" + lat + "," + lng + "&z=16");
        hs.setMeta('og:latitude', lat);
        hs.setMeta('og:longitude', lng);
        if ((this.lat != null) && (this.lng != null)) {
          return this.updateLocation();
        }
      }
    },
    updateLocation: function(position) {
      var brng, direction, dist, distStr, listingLoc, userLoc, _ref, _ref2;
      if ((this.model.get('latitude') != null) && (this.model.get('longitude') != null)) {
                if ((_ref = this.lat) != null) {
          _ref;
        } else {
          this.lat = position.coords.latitude;
        };
                if ((_ref2 = this.lng) != null) {
          _ref2;
        } else {
          this.lng = position.coords.longitude;
        };
        listingLoc = new LatLon(this.model.get('latitude'), this.model.get('longitude'));
        userLoc = new LatLon(this.lat, this.lng);
        dist = parseFloat(userLoc.distanceTo(listingLoc));
        brng = userLoc.bearingTo(listingLoc);
        direction = _.degreesToDirection(brng);
        if (dist < 1) {
          distStr = Math.round(dist * 1000) + ' metres';
        } else {
          distStr = Math.round(dist * 100) / 100 + ' km';
        }
        return this.$('#listing-locDiff').text("Roughly " + distStr + " " + direction + " of you.");
      }
    },
    updatePrice: function() {
      if (this.model.get('price') != null) {
        return this.$('.asking.value').text('$' + this.model.get('price'));
      }
    },
    updateOffers: function() {
      this.model.bestOffer(__bind(function(best) {
        var node;
        if (best) {
          node = this.$('.best-offer.value');
          node.text('$' + best.get('amount'));
          node.animate({
            color: '#828200'
          }, 250, function() {
            return node.animate({
              color: '#008234'
            }, 250);
          });
          return best.withRel('creator', __bind(function(bestCreator) {
            return this.$('.best-offer.details').text("by " + (bestCreator.get('name')));
          }, this));
        }
      }, this));
      return this.updateAuth(__bind(function() {
        if (!this.isOwner && this.isAuthd) {
          this.model.withField('offers', __bind(function() {
            var myOffer, node;
            myOffer = this.model.get('offers').find(__bind(function(offer) {
              return offer.get('creator')._id === hs.users.User.get()._id;
            }, this));
            if (myOffer != null) {
              node = this.$('.my-offer.value');
              node.text('$' + myOffer.get('amount'));
              return node.animate({
                color: '#828200'
              }, 250, function() {
                return node.animate({
                  color: '#2E63A1'
                }, 250);
              });
            }
          }, this));
        } else {
          this.$('.my-offer.value').text('$0');
        }
        return this.$('.my-offer.details').text(this.model.get('offers').length + ' others');
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
