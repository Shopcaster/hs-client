dep.require 'hs.Template'
dep.require 'hs.t.ListingLI'
dep.require 'hs.geo'

dep.provide 'hs.t.Home'


class hs.t.Home extends hs.Template

  appendTo: '#main'


  template: -> '''
    <div class="home">
      <div class="splash">
        <div class="left">
          <iframe src="http://player.vimeo.com/video/27782331?title=0&amp;byline=0&amp;portrait=0&amp;color=3F74B2" width="480" height="270" frameborder="0"></iframe>
        </div>
        <div class="right">
          <h3>Sellers</h3>
          <p class="tagline">Snap. Post. Sell.</p>
          <p class="desc top">Post an item from your phone in under 30 seconds.
          Share on Facebook and Twitter and we'll help you get your item sold fast.</p>

          <h3>Buyers</h3>
          <p class="tagline">Browse. Want. Buy.</p>
          <p class="desc">Browse items near you and communicate in real-time.
          Know if the item is still available and who you're buying from.</p>

          <p class="platforms">Available now for
          <a href="http://itunes.apple.com/ca/app/hipsell/id455074551?mt=8&uo=4">iOS</a>
          and
          <a target="_blank" href="https://market.android.com/details?id=com.hipsell.Hipsell&feature=search_result">Android</a></p>
        </div>
        <a class="close pictos" href="javascript:;">D</a>
      </div>
      <div class="expand"><a href="javascript:;">What is Hipsell again?</a></div>
      <div style="clear:both"></div>
      <div class="listings"></div>
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
    run = false
    hs.geo.get (pos)=>
      return if run
      run = true

      zz.data.listing.query('location-near')
        .params(latitude: pos.coords.latitude, longitude: pos.coords.longitude)
        .limit(24)
        .offset(this.rendered)
        .run (listings)=>
          if listings.length < 24
            this.scrollDone = true

          for listingID in listings
            this.rendered++
            holder = $('<div class="listing-wrap"></div>')
            this.$('.listings').append holder
            do (listingID, holder)=> zz.data.listing listingID, (listing)=>
              tmpl = this.listingTmpl listing, appendTo: holder
              scroll = tmpl.el.offset().top
              this.scrollTrigger = scroll if scroll > this.scrollTrigger

