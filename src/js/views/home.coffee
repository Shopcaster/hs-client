
dep.require 'hs.View'


class hs.v.Home extends hs.View

  events:
    'click .close': 'closeSplash'
    'click .expand a': 'expandSplash'

  init:->
    this.closeSplash() if localStorage['splashHidden'] == 'true'

    this.scroll = _.bind this.scroll, this
    $(window).bind 'scroll', this.scroll

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
            this.template.$('.listings').append holder
            do (listingID, holder)=> zz.data.listing listingID, (listing)=>
              tmpl = this.template.listingTmpl listing, appendTo: holder
              scroll = tmpl.el.offset().top
              this.scrollTrigger = scroll if scroll > this.scrollTrigger


  preRemove: -> $(window).unbind 'scroll', this.scroll


  scroll: (e)->
    scrollAt = $(window).scrollTop() + $(window).height()
    if not this.scrollDone and scrollAt > this.scrollTrigger
      this.renderListings()


  closeSplash: ->
    this.template.$('.splash').hide()
    this.template.$('.expand').show()
    localStorage['splashHidden'] = 'true'


  expandSplash: ->
    this.template.$('.expand').hide()
    this.template.$('.splash').show()
    localStorage['splashHidden'] = 'false'
