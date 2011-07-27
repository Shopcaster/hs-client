
dep.require 'hs.Template'
dep.require 'hs.t.ListingLI'

dep.provide 'hs.t.UserListings'


class hs.t.UserListings extends hs.Template

  template: ->
    div class: 'user-listings'


  subTemplates:
    listing:
      class: hs.t.ListingLI


  sort: (one, two) ->  two.created - one.created


  addModel: (listing, index) ->
    index = undefined if index == -1

    this.listingTmpl listing,
      nthChild: index
      appendTo: "##{this.id}"


  removeModel: (id, index) ->
    this.removeTmpl 'ListingLI', index


