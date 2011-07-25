
dep.require 'hs.Template'
dep.require 'hs.t.InlineUser'
dep.require 'hs.t.ConvoDialog'

dep.provide 'hs.t.ConvoLI'

class hs.t.ConvoLI extends hs.Template

  template: ->
    div class: 'convo-li li', ->
      div class: 'offerbox', ->
        div class: 'offer', href: 'javascript:;', -> '$0'
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

    zz.data.listing this.model.listing, (listing) =>
      zz.data.user this.model.creator, (creator) =>
        listing.offerForUser creator, (offer) =>
          if offer?
            this.offer = offer
            this.offer.heat()
            this.offer.on 'amount', _.bind(this.setAmount, this)
            this.setAmount()

          this.listing = listing
          this.listing.heat()
          this.listing.on 'accepted', _.bind(this.setAccepted, this)
          this.listing.on 'sold', _.bind(this.setSold, this)
          this.setSold()
          this.setAccepted()


  setCreator: ->
    this.userTmpl.remove()
    zz.data.user this.model.creator, (creator) =>
      this.userTmpl creator, prependTo: '#'+this.id


  setAmount: ->
    this.$('.offerbox').show()
    this.$('.offer').text "$#{this.offer.amount/100}"


  setAccepted: ->
    return if this.listing.sold

    this.$('.accepted').remove()
    this.$('.accept-offer').remove()

    if this.listing.accepted? and this.offer? and this.listing.accepted == this.offer._id
      this.el.addClass 'accepted'
      this.$('.offerbox').append '
        <span class="accepted">
          Offer Accepted -
          <a href="javascript:;" class="cancel-offer">cancel</a> |
          <a href="javascript:;" class="sold-offer">sold</a>
        </span>'

    else
      this.el.removeClass 'accepted'
      this.$('.offerbox').append '
        <a class="accept-offer" href="javascript:;">Accept Offer</a>'

    this.emit 'acceptedRendered'


  setSold: ->
    if this.offer? and this.listing.sold and this.listing.accepted == this.offer._id
      this.$('.accepted').remove()
      this.$('.accept-offer').remove()
      this.el.removeClass 'accepted'
      this.el.addClass 'sold'


  preRemove: ->
    this.offer.freeze() if this.offer?
    this.listing.freeze() if this.listing?
