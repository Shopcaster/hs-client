
dep.require 'hs.Template'
dep.require 'hs.t.ListingLI'

dep.provide 'hs.t.Home'


class hs.t.Home extends hs.Template

  appendTo: '#main'


  template: -> '''
    <div class="home">
      <div class="splash">
        <div class="left">
          <iframe width="560" height="349" src="http://www.youtube.com/embed/jl1devFMfD4" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="right">
          <h3>Sellers – Snap. Post. Sell.</h3>
          <p>Post an item from your phone in under 30 seconds. It will be prossposted to Craigslist and Kijiji to help your item sell fast.</p>
          <h3>Buyers – Browse. Want. Buy.</h3>
          <p>Browse items near you and communicate in real-time. Know if the item is still available and who you're buying from.</p>
        </div>
        <a class="close pictos" href="javascript:;">D</a>
      </div>
      <a href="javascript:;" class="expand" style="display:none;">What is Hipsell again?</a>
    </div>
  '''


  subTemplates:
    listing:
      class: hs.t.ListingLI


  postRender: ->
    this.rendered = 0
    this.scrollTrigger = 0
    this.scrollDone = false

    this.renderListings()


  renderListings: ->
    zz.data.listing.query().sort('-created').limit(24).offset(this.rendered).run (listings)=>

      if listings.length < 24
        this.scrollDone = true

      for listingID in listings then do (listingID)=>
        this.rendered++
        zz.data.listing listingID, (listing)=>
          tmpl = this.listingTmpl listing, appendTo: '#'+this.id
          scroll = tmpl.el.offset().top
          this.scrollTrigger = scroll if scroll > this.scrollTrigger

