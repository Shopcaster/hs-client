//depends:
// core/views/main.js,
// core/views/forms/form.js,
// listings/views/main.js,
// listings/models.js,
// core/views/authForm.js


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
    $('#newListing').css({display: 'block'}).click(this.newBind);
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
