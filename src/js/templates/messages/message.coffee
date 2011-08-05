
dep.require 'hs.Template'
dep.require 'hs.t.InlineUser'
dep.require 'zz'

dep.provide 'hs.t.Message'

class hs.t.Message extends hs.Template

  template: -> """
    <div class="message li">
      <div class="creator"></div>
      <div class="message-body"></div>
      <div class="actions"></div>
    </div>
    """


  subTemplates:
    user:
      class: hs.t.InlineUser


  setOffer: -> this.el.addClass 'offer' if this.model.offer?


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
    since = this.model.created.since()
    this.$('.created').text since.num+' '+since.text
