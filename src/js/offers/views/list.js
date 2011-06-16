//depends: core/views/view.js,
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
      appendTo: this.$('#offerFormWrap'),
      listing: this.model
    });
    this.renderOffers();
  },
  offerViews: new Object(),
  renderOffers: function(){
    var offers = this.model.get('offers');
    // add new offers
    offers.each(function(offer){
      if (_.isUndefined(this.offerViews[offer._id])){
        this.offerViews[offer._id] = new hs.offers.views.Offer({
          appendTo: $('#offerList'),
          model: offer
        });
      }else hs.log('didn\'t render offer', offer._id);
    }, this);
    // remove old offers
    var offerIds = offers.map(function(o){return o._id});
    _.each(_.keys(this.offerViews), function(id){
      if (!_.include(offerIds, id)){
        hs.log('removing', newOfferIds, id);
        this.offerViews[id].remove();
        delete this.offerViews[id];
      }
    }, this);
    // render offers
    _.each(this.offerViews, function(view){
      if (!view.rendered) view.render();
    }, this);
  },
  offersChange: function(){
    this.renderOffers();
  }
});
