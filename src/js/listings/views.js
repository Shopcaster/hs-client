//depends: core/views.js,
//         core/date.js,
//         core/forms/views.js,
//         listings/main.js,
//         listings/models.js,
//         offers/views/list.js,
//         inquiries/views/list.js,
//         auth/views.js

hs.listings.views = hs.listings.views || new Object();

hs.listings.views.ListingPage = hs.views.Page.extend({
  template: 'listingPage',
  modelEvents: {
    'change:photo': 'updatePhoto',
    'change:description': 'updateDesc',
    'change:created': 'updateCreated',
    'change:updated': 'updateCreated',
    'change:latitude': 'updateLoc',
    'change:longitude': 'updateLoc',
    'change:price': 'updatePrice',
    'change:offers': 'updateBestOffer'
  },
  render: function(){
    hs.views.Page.prototype.render.apply(this, arguments);

    this.offers = new hs.offers.views.Offers({
      el: $('#listing-offers'),
      model: this.model
    });
    this.offers.render();

    this.inquiries = new hs.inquiries.views.Inquiries({
      el: $('#listing-inquiries'),
      model: this.model
    });
    this.inquiries.render();
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
    if (this.model.get('created')){
      var since = Date.since(this.model.get('created'));
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
    this.model.bestOffer(_.bind(function(best){
      if (best) this.$('.best-offer .listing-obi-value')
            .text('$'+best.get('amount'));
    }, this));
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
    this.model = new hs.listings.models.Listing();
    this.bind('change', _.bind(function(){
      this.model.set(this.toJSON());
    }, this));
  },
  submit: function(){
    this.model.bind('change', _.bind(function gt(){
      this.model.unbind(gt);
      hs.goTo('!/listings/'+this.model.id+'/');
    }, this));
    this.model.save(null, {error: function(){
      console.log('save error', arguments);
    }});
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
