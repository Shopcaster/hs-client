
dep.require 'hs.Template'
dep.require 'hs.t.ListingLI'

dep.provide 'hs.t.Home'


class hs.t.Home extends hs.Template

  appendTo: '#main'


  template: -> '''
    <div class="home">
      <div class="splash">
        Hipsell is currently in beta. If your interested in trying it out, please fill out this form: <a href="http://★.to/oeIeDr">★.to/oeIeDr</a>.
      </div>
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

