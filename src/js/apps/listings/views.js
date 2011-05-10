//depends: core/views.js, core/date.js,
//         apps/listings/main.js,
//         apps/listings/tmpl/listingPage.tmpl,
//         apps/listings/tmpl/listingForm.tmpl

hs.listings.views = new Object();

hs.listings.views.ListingPage = hs.views.Page.extend({
  template: 'listingPage',
  initialize: function(){
    hs.views.Page.prototype.initialize.apply(this, arguments);
    this.model.bind('change:photo', _.bind(this.updatePhoto, this));
    this.model.bind('change:description', _.bind(this.updateDesc, this));
    this.model.bind('change:created_on', _.bind(this.updateCreated, this));
    this.model.bind('change:latitude', _.bind(this.updateLoc, this));
    this.model.bind('change:longitude', _.bind(this.updateLoc, this));
    this.model.bind('change:price', _.bind(this.updatePrice, this));
    this.model.bind('change:best_offer', _.bind(this.updateBestOffer, this));
  },
  updatePhoto: function(){
    if (this.model.get('photo')){
      this.$('#listing-image img')
          .attr('src', this.model.get('photo').web);
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
    if (this.model.get('created_on')){
      var since = Date.since(this.model.get('created_on'));
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
          +'&zoom=14&size=340x200&sensor=false');
    }
  },
  updatePrice: function(){
    if (this.model.get('price')){
      this.$('.asking .listing-obi-value').text('$'+this.model.get('price'));
    }
  },
  updateBestOffer: function(){
    if (this.model.get('best_offer')){
      this.$('.best-offer .listing-obi-value')
          .text('$'+this.model.get('best_offer').amount);
    }else{
      this.$('.best-offer .listing-obi-value').text('$0');
    }
  }
});


hs.listings.views.OfferForm = hs.views.View.extend({
  template: 'offerForm',
  el: $('body'),
  events: {
    'click #offer': 'makeOffer'
  },
  initialize: function(){
    hs.views.View.prototype.initialize.apply(this, arguments);
  },
  makeOffer: function(){
    if (!this.rendered)
      this.render();

  }
});




hs.listings.views.ListingForm = hs.views.Form.extend({
  template: 'listingForm',
  fields: {
    'image': '',
    'description': '',
    'price': ''
  },
  initialize: function(){
    hs.views.Form.prototype.initialize.apply(this, arguments);
    $('#newListing').parent().addClass('active');
    $('#newListing').click(_.bind(function(e){
      this._submit(e);
    }, this));
    this.bind('change:price', _.bind(function(){
      this.set('price', this.get('price').replace('$', ''));
    }, this));
  },
  submit: function(){
    hs.log('TODO:submit ListingForm');
  },
  validateDescription: function(value, clbk){
    clbk(value.length > 0 && value.length < 141);
  },
  validatePrice: function(value, clbk){
    clbk(/^\d+$/.test(value));
  },
  validateImage: function(value, clbk){
    clbk(value.length != 0);
  },
});
