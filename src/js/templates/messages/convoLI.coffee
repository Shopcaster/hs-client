
dep.require 'hs.Template'
dep.require 'hs.t.InlineUser'
dep.require 'hs.t.ConvoDialog'

dep.provide 'hs.t.ConvoLI'

class hs.t.ConvoLI extends hs.Template

  template: -> """
    <div class="convo-li li">
      <div class="inside">
        <span class="message-preview">
          <a class="count" href="javascript:;"></a>
          <span class="message"></span>
        </span>
        <div class="offerbox">
          <div class="offer">$0</div>
        </div>
      </div>
      <div class="clicky"></div>
    </div>
    """


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

        this.messages = messages
        this.messages.on 'add', _.bind(this.setMessage, this)
        this.setMessage this.messages[0], 0 if this.messages[0]?

    if not this.model.creator?
      this.userTmpl null, prependTo: '#'+this.id

    else
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
            this.listing.on 'sold', _.bind(this.setSold, this)
            this.setSold()


  preRemove: ->
    this.offer.freeze() if this.offer?
    this.listing.freeze() if this.listing?


  setCreator: ->
    return if not this.model.creator?

    this.userTmpl.remove()
    zz.data.user this.model.creator, (creator) =>
      this.userTmpl creator, prependTo: '#'+this.id


  setAmount: ->
    this.$('.offerbox').show()
    this.$('.offerbox > .offer').text "$#{this.offer.amount/100}"


  setMessage: (msg, index) ->
    ## Message preview, gone for now.
    #for message in this.messages
    #  if message.creator != zz.auth.curUser()._id
    #    this.$('.message-preview .message').text ' | '+message.message.truncateWords(50)
    #    break

    this.$('.message-preview .count').text "#{this.messages.length} messages"


  setSold: ->

    if this.offer? and this.listing.sold and this.listing.accepted == this.offer._id
      this.$('.accept-offer').remove()
      this.$('.sold').remove()
      this.el.addClass 'accepted'
      this.$('.offerbox').append '<span class="sold">sold</span>
        <a href="javascript:;" class="cancel-sold">(cancel)</a>'

    else if this.offer?
      this.$('.sold').remove()
      this.$('.cancel-sold').remove()
      this.el.removeClass 'accepted'
      this.$('.offerbox').append '
        <a class="accept-offer" href="javascript:;">Accept Offer</a>'

    this.emit 'domEventChanges'

