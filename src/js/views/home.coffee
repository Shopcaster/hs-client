
dep.require 'hs.View'


class hs.v.Home extends hs.View

  events:
    'click .close': 'closeSplash'
    'click .expand a': 'expandSplash'

  init:->
    VideoJS.setupAllWhenReady();

    this.scroll = _.bind this.scroll, this
    $(window).bind 'scroll', this.scroll

    this.closeSplash() if localStorage['splashHidden'] == 'true'


  preRemove: -> $(window).unbind 'scroll', this.scroll


  scroll: (e)->
    if not this.template.scrollDone and
        $(window).scrollTop() + $(window).height() > this.template.scrollTrigger
      this.template.renderListings()


  closeSplash: ->
    this.template.$('.splash').hide()
    this.template.$('.expand').show()
    localStorage['splashHidden'] = 'true'


  expandSplash: ->
    this.template.$('.expand').hide()
    this.template.$('.splash').show()
    localStorage['splashHidden'] = 'false'
