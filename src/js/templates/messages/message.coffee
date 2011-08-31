
dep.require 'hs.Template'
dep.require 'hs.t.InlineUser'
dep.require 'zz'

dep.provide 'hs.t.Message'

class hs.t.Message extends hs.Template

  template: -> """
    <div class="message li">
      <div class="creator"></div>
      <span class="created"></span>
      <div class="message-body"></div>
      <div class="actions"></div>
    </div>
    """


  subTemplates:
    user:
      class: hs.t.InlineUser


  postRender:->
    console.log 'message postRender'
    this.listingSub = false
    this.setOffer = _.bind this.setOffer, this


  preRemove:->
    if this.listingSub
      this.listing.removeListener 'accepted', this.setOffer



  setOffer: ->
    console.log 'setOffer'
    if this.model.offer?
      this.el.addClass 'offer'
      ###
      withListing = =>

        if zz.auth.curUser()._id == this.listing.creator

          if this.listing.sold and this.listing.accepted = this.model.offer
            this.$('.accept-offer-inline').remove()
            this.$('.actions').append '
              <a href="javascript:;" class="cancel-offer-inline">Cancel</a>'

          else
            this.$('.cancel-offer-inline').remove()
            this.$('.actions').append '
              <a href="javascript:;" class="accept-offer-inline">Accept</a>'

          if not this.listingSub == false
            this.listing.on 'sold', this.setOffer
            console.log 'sub on listing', this.listing
            console.log this.setOffer
            this.listing.emit 'sold'
            this.listingSub = true


      if not this.listing?
        zz.data.listing this.model, 'convo', 'listing', (listing)=>
          this.listing = listing
          withListing()
      else
        withListing()
    ###


  setCreator: ->
    return if this.model.offer?

    if not this.model.creator?
        this.userTmpl null, appendTo: "##{this.id} .creator"


    else
      zz.data.user this.model.creator, (creator) =>
        this.userTmpl creator, appendTo: "##{this.id} .creator"

        zz.data.listing this.model, 'convo', 'listing', (listing) =>
          cur = zz.auth.curUser()

          if cur._id != creator._id and listing.creator == cur._id
            this.$('.actions').html '<a href="javascript:;"
              data-message="#{this.model._id}" class="pub">Answer Publicly</a>'


  setMessage: ->
    this.$('.message-body').text this.model.message


  setCreated: ->
    return unless this.model.created instanceof Date
    this.$('.created').liveSince this.model.created
