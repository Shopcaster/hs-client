
dep.require 'hs.Template'
dep.require 'hs.t.InlineUser'
dep.require 'hs.t.ConvoDialog'

dep.provide 'hs.t.ConvoLI'

class hs.t.ConvoLI extends hs.Template

  template: ->
    div class: 'convo-li li', ->
      div class: 'offer', -> '$0'
      div class: 'clicky'


  subTemplates:
    user:
      class: hs.t.InlineUser
    convo:
      class: hs.t.ConvoDialog


  postRender: ->
    zz.data.listing this.model.listing, (listing) =>
      this.model.relatedMessages (messages) =>
        this.convoTmpl messages,
          convo: this.model
          listing: listing
          focusSelector: "##{this.id}"
          appendTo: "##{this.id}"


  setCreator: ->
    zz.data.user this.model.creator, (creator) =>
      this.userTmpl creator, prependTo: '#'+this.id

      zz.data.listing this.model.listing, (listing) =>
        listing.offerForUser creator, (offer) =>
          this.$('.offer').text "$#{offer.amount}" if offer?
