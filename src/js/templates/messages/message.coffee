
dep.require 'hs.Template'
dep.require 'hs.t.InlineUser'
dep.require 'zz'

dep.provide 'hs.t.Message'

class hs.t.Message extends hs.Template

  template: ->
    div class: 'message li', ->
      div class: 'creator'
      div class: 'message-body'
      div class: 'actions'


  subTemplates:
    user:
      class: hs.t.InlineUser


  setCreator: ->
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
    since = _.since this.model.created
    this.$('.created').text since.num+' '+since.text
