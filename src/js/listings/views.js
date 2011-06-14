//depends: core/views/main.js,
//         core/views/forms/form.js,
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
    'change:modified': 'updateCreated',
    'change:latitude': 'updateLoc',
    'change:longitude': 'updateLoc',
    'change:price': 'updatePrice',
    'change:offers': 'updateBestOffer',
    'change:sold': 'updateSold'
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
          +'&zoom=14&size=340x200&sensor=false');
      this.$('.mapLink').attr('href', 'http://maps.google.com/?'
          +'ll='+lat+','+lng+'&z=16')
    }
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
      hs.log('!!SOLD!!');
    }
  }
});


hs.listings.views.ListingForm = hs.auth.views.AuthForm.extend({
  template: 'listingForm',
  fields: [
    {
      'name': 'image',
      'type': 'image_capture',
      'placeholder': 'Image',
      'required': true
    },
    {
      'name': 'description',
      'type': 'textarea',
      'placeholder': 'Description',
      'required': true
    },
    {
      'name': 'price',
      'type': 'text',
      'placeholder': 'Price',
      'required': true
    }
  ].concat(hs.auth.views.AuthForm.prototype.fields),
  initialize: function(){
    this.model = new hs.listings.models.Listing();
    hs.auth.views.AuthForm.prototype.initialize.apply(this, arguments);
    $('#newListing').parent().addClass('active');
    this.newBind = _.bind(this._submit, this);
    $('#newListing').click(this.newBind);
    this.bind('change:price', _.bind(function(){
      this.set('price', this.get('price').replace('$', ''));
    }, this));
    if (Modernizr.geolocation)
      navigator.geolocation.getCurrentPosition(_.bind(this.updateLocation, this));
  },
  updateLocation: function(position){
    this.position = position.coords;
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
  submit: function(){
    this.model.set({
      photo: this.get('image'),
      description: this.get('description'),
      price: parseFloat(this.get('price').replace('$', ''))
    });
    if (this.position)
      this.model.set({
        latitude: this.position.latitude,
        longitude: this.position.longitude
      });
    hs.log('saving');
    this.model.save(null, {
      success: function(){
        hs.log('saved, goto');
        hs.goTo('!/listings/thanks/');
      },
      error: function(){
        console.log('save error', arguments);
      }
    });
  },
  finish: function(){
    $('#newListing').parent().removeClass('active');
    $('#newListing').unbind('click', this.newBind);
  }
});


hs.listings.views.Thanks = hs.views.Page.extend({
  template: 'thanks',
  initialize: function(){
    // hs.auth.views.Page.prototype.initialize.apply(this, arguments);
    $('#newListing').parent().addClass('thanks');
    this.newBind = _.bind(this.again, this);
    $('#newListing').click(this.newBind);
    $('#newListing').text('Again');
  },
  again: function(){
    $('#newListing').parent().removeClass('thanks');
    $('#newListing').unbind('click', this.newBind);
    $('#newListing').text('Post');
    hs.goTo('!/listings/new/');
  }
});


hs.listings.views.List = hs.views.Page.extend({
  template: 'listings'
});
