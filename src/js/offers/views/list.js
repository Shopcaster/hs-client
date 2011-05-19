//depends: core/views.js,
//         offers/views/main.js,
//         offers/views/form.js,
//         offers/views/offer.js

hs.offers.views.Offers = hs.views.View.extend({
  template: 'offers',
  modelEvents: {
    'change:offers': 'offersChange'
  },
  render: function(){
    this._tmplContext.offers = this.model.get('offers').toJSON();
    hs.views.View.prototype.render.apply(this, arguments);
    this.offerForm = this.offerForm || new hs.offers.views.Form({
      appendTo: this.$('#offerForm'),
      listing: this.model
    });
    this.renderOffers();
  },
  offerViews: new Object(),
  renderOffers: function(){
    var newOffers = this.model.get('offers');
    var newOfferIds = [];
    // add new offers
    _.each(newOffers, _.bind(function(o, i){
      var offer = newOffers.at(i);
      newOfferIds.push(offer.id);
      if (_.isUndefined(this.offerViews[offer.id])){
        this.offerViews[offer.id] = new hs.offers.views.Offer({
          appendTo: $('#offerList'),
          model: offer
        });
      }
    }, this));
    // remove old offers
    _.each(_.keys(this.offerViews), _.bind(function(id){
      id = parseInt(id);
      if (!_.include(newOfferIds, id))
        delete this.offerViews[id];
    }, this));
    // render offers
    _.each(this.offerViews, _.bind(function(view){
      if (!view.rendered) view.render();
    }, this));
  },
  offersChange: function(){
    this.renderOffers();
  }
});
