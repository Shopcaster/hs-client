//depends: core/views/view.js,
//         offers/views/main.js,
//         offers/views/form.js,
//         offers/views/offer.js

hs.offers.views.Offers = hs.views.View.extend({
  template: 'offers',
  modelEvents: {
    'change:offers': 'offersChange',
    'add:offers': 'offersAdd',
    'remove:offers': 'offersRemove'
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
    this.model.get('offers').each(function(offer){
      if (_.isUndefined(this.offerViews[offer._id])){
        this.offerViews[offer._id] = new hs.offers.views.Offer({
          appendTo: $('#offerList'),
          model: offer
        });
      }
      if (!this.offerViews[offer._id].rendered)
        this.offerViews[offer._id].render();
    }, this);
  },
  offersChange: function(){
    this.renderOffers();
  },
  offersAdd: function(){
    this.renderOffers();
  },
  offersRemove: function(offers){
    _.each(offers, function(offer){
      if (!_.isUndefined(this.offerViews[offer._id])){
        this.offerViews[offer._id].remove();
        delete this.offerViews[offer._id];
      }
    }, this);
  }
});
