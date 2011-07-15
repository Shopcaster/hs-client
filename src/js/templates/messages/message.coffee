
dep.require 'hs.Template'
dep.require 'hs.t.InlineUser'
dep.require 'zz'

dep.provide 'hs.t.Message'

class hs.t.Message extends hs.Template

  template: ->
    div class: 'message', ->
      div class: 'creator'
      div class: 'message-body'
      div class: 'actions'


  subTemplates:
    user:
      class: hs.t.InlineUser


  setCreator: ->
    zz.data.user this.model.creator, (creator) =>
      this.userTmpl creator, appendTo: "##{this.id} .creator"


  setMessage: ->
    this.$('.message-body').text this.model.message


  setCreated: ->
    since = _.since this.model.created
    this.$('.created').text since.num+' '+since.text
