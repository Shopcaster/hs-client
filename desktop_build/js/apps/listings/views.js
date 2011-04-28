//depends: apps/listings/main.js, core/views.js, core/date.js

hs.listings.views = new Object();

hs.listings.views.ListingPage = hs.views.Page.extend({
    template: 'listingPage',
    events: {
        'click #offer': 'makeOffer'
    },
    initialize: function(){
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
    },
    // render: function(){
    //     hs.views.Page.prototype.render.apply(this, arguments);
    //     this.model.change();
    // },
    makeOffer: function(e){
        e.preventDefault();
        var dialog = new hs.listings.views.offerDialog();
        dialog.bind('submit', _.bind(function(){
            var offer = new hs.listings.models.Offer();
            offer.set('amount', dialog.amount);
            offer.save();
        }, this)).render();
    },
});
