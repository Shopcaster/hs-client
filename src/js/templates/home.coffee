
dep.require 'hs.Template'
dep.require 'hs.t.ListingLI'
dep.require 'hs.geo'

dep.provide 'hs.t.Home'

###TO be added when video is ready
        <div class="video-js-box" id="splash-video">
          <video class="video-js" width="480" height="272" controls preload poster="/video/test2.png">
            <source src="/video/test.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
            <source src="/video/test.webm" type='video/webm; codecs="vp8, vorbis"' />
            <source src="/video/test.ogv" type='video/ogg; codecs="theora, vorbis"' />
            <object class="vjs-flash-fallback" width="480" height="272" type="application/x-shockwave-flash"
              data="http://www.youtube.com/v/jl1devFMfD4">
              <param name="movie" value="http://www.youtube.com/v/jl1devFMfD4" />
              <param name="allowfullscreen" value="true" />
              <img src="/video/test2.png" width="480" height="272>
            </object>
          </video>
        </div>
###


class hs.t.Home extends hs.Template

  appendTo: '#main'


  template: -> '''
    <div class="home">
      <div class="splash">
        <div class="left">
          <img width="480" height="272" src="/video/soon.png">
        </div>
        <div class="right">
          <h3>Sellers</h3>
          <p class="tagline">Snap. Post. Sell.</p>
          <p class="desc top">Post an item from your phone in under 30 seconds.
          We'll crosspost it to Craigslist and Kijiji to get your item sold fast.</p>

          <h3>Buyers</h3>
          <p class="tagline">Browse. Want. Buy.</p>
          <p class="desc">Browse items near you and communicate in real-time.
          Know if the item is still available and who you're buying from.</p>

          <p class="platforms">Coming soon to iPhone and Android</p>
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

          for listingID in listings then do (listingID)=>
            this.rendered++
            zz.data.listing listingID, (listing)=>
              tmpl = this.listingTmpl listing, appendTo: '#'+this.id+' .listings'
              scroll = tmpl.el.offset().top
              this.scrollTrigger = scroll if scroll > this.scrollTrigger

