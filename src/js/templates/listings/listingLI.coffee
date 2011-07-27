
dep.require 'hs.Template'

dep.provide 'hs.t.ListingLI'

class hs.t.ListingLI extends hs.Template

  template: ->
    a class: 'listing listing-li', ->
      img class: 'listing-image'
      div class: 'listing-info', ->
        span class: 'status', => 'Available'
        div class: 'listing-desc'
        div class: 'created'
        div class: 'asking', ->
          div class: 'title', -> 'Asking Price'
          div class: 'value'
        div class: 'link', href: 'javascript:;', ->
          'Click for more info.'


  postRender: ->
    this.el.attr 'href', '/'+this.model._id


  setPhoto: () ->
    url = "http://#{conf.zz.server.host}:#{conf.zz.server.port}/#{this.model.photo}"
    this.$('.listing-image').attr 'src', url


  setAccepted: -> this.setStatus()
  setSold: -> this.setStatus()
  setStatus: ->
    if this.model.accepted? and not this.model.sold
      this.$('.status').text('Offer Accepted').addClass('accepted').removeClass('sold')
    else if this.model.sold
      this.$('.status').text('Sold').addClass('sold').removeClass('accepted')
    else
      this.$('.status').text('Available').removeClass('sold').removeClass('accepted')


  setDescription: ->
    this.$('.listing-desc').text this.model.description.truncateWords 50


  setCreated: () ->
    since = this.model.created.since()
    this.$('.created').text "#{since.num} #{since.text}"


  setPrice: () ->
    this.$('.asking .value').text "$#{this.model.price}"
