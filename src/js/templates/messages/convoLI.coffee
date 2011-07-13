
dep.require 'hs.Template'
dep.provide 'hs.t.ConvoLI'

class hs.t.ConvoLI extends hs.Template

  template: ->
    div class: 'convo-li', ->
      div class: 'offer'
      div class: 'actions'
      div class: 'clicky'


  subTemplates:
    user:
      class: hs.t.InlineUser


  setCreator: ->
    zz.data.creator this.model.creator, (creator) =>
      this.userTmpl creator, prependTo: "convo-li-#{this.model._id}"

      zz.data.listing this.model.listing, (listing) =>
        listing.offerForUser creator, (offer) =>
          this.$('.offer').text "$#{offer.amount}"
