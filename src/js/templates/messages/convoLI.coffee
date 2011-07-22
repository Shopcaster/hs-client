
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
    setAmount = this.setAmount
    this.setAmount = => setAmount.apply(this, arguments)

    setAccepted = this.setAccepted
    this.setAccepted = => setAccepted.apply(this, arguments)

    #this.setAmount = _.bind this.setAmount, this
    #this.setAccepted = _.bind this.setAccepted, this

    zz.data.listing this.model.listing, (listing) =>
      this.model.relatedMessages (messages) =>
        this.convoTmpl messages,
          convo: this.model
          listing: listing
          focusSelector: "##{this.id}"
          appendTo: "##{this.id}"

    this.subSubs()


  subSubs: ->
    this.unSub()

    zz.data.listing this.model.listing, (listing) =>

      zz.data.user this.model.creator, (creator) =>
        listing.offerForUser creator, (offer) =>
          if offer?
            this.offer = offer
            this.offer.on 'amount', this.setAmount
            this.setAmount()

          this.listing = listing
          this.listing.on 'accepted', this.setAccepted
          this.setAccepted()


  unSub: ->
    this.offer.removeListener 'amount', this.setAmount if this.offer?
    this.listing.removeListener 'accepted', this.setAccepted if this.listing?


  setCreator: ->
    this.userTmpl.remove()
    zz.data.user this.model.creator, (creator) =>
      this.userTmpl creator, prependTo: '#'+this.id


  setAmount: ->
    this.$('.offerbox').show()
    this.$('.offer').text "$#{this.offer.amount/100}"


  setAccepted: ->
    this.$('.accepted').remove()
    this.$('.accept-offer').remove()

    if this.listing.accepted? and this.offer? and this.listing.accepted = this.offer._id
      console.log 'setting accepted', this, this.listing.accepted
      this.el.addClass 'accepted'
      this.$('.offerbox').append '
        <span class="accepted">
          Offer Accepted -
          <a href="javascript:;" class="cancel-offer">cancel</a> -
          <a href="javascript:;" class="sold-offer">sold</a>
        </span>'

    else
      this.el.removeClass 'accepted'
      this.$('.offerbox').append '
        <a class="accept-offer" href="javascript:;">Accept Offer</a>'


  preRemove: -> this.unSub()
