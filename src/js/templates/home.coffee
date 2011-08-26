
dep.require 'hs.Template'
dep.require 'hs.t.ListingLI'
dep.require 'hs.geo'

dep.provide 'hs.t.Home'

### Better video, not working in FF for some reason

          <div class="video-js-box" id="splash-video">
            <video class="video-js" width="480" height="270" controls preload poster="/video/video.png">
              <source src="/video/video.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
              <source src="/video/video.webm" type='video/webm; codecs="vp8, vorbis"' />
              <source src="/video/video.ogv" type='video/ogg; codecs="theora, vorbis"' />
              <object class="vjs-flash-fallback" width="480" height="270" type="application/x-shockwave-flash" data="http://vimeo.com/moogaloop.swf?clip_id=27782331&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=00adef&amp;fullscreen=1&amp;autoplay=0&amp;loop=0">
                <param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=27782331&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=00adef&amp;fullscreen=1&amp;autoplay=0&amp;loop=0" />
                <param name="allowfullscreen" value="true" />
                <param name="allowscriptaccess" value="always" />
                <img src="/video/video.png" width="480" height="270">
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
          <iframe src="http://player.vimeo.com/video/27782331?title=0&amp;byline=0&amp;portrait=0&amp;color=3F74B2" width="480" height="270" frameborder="0"></iframe>
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

