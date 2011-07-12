
dep.require 'hs.Template'
dep.require 'zz'

dep.provide 'hs.t.Message'

class hs.t.Message extends hs.Template

  template: ->
    div class: 'message', id: "message-#{this.model._id}", ->
      div class: 'creator'
      div class: 'message-body'
      div class: 'actions'


  subTemplates:
    user:
      class: hs.t.InlineUser


  setCreator: ->
    zz.data.creator this.model.creator, (creator) =>
      this.userTmpl creator, prependTo: "message-#{this.model._id}"


  setMessage: ->
    this.$('.message-body').text this.model.message


  setCreated: ->
    since = _.since this.model.created
    this.$('.created').text since.num+' '+since.text
