
dep.require 'hs.Template'
dep.require 'hs.t.MessageForm'
dep.require 'hs.t.Message'

dep.provide 'hs.t.Convo'

class hs.t.Convo extends hs.Template

  template: ->
    div class: 'convo', ->
      div class: 'message-form'
      div class: 'message-list'


  subTemplates:
    message:
      class: hs.t.Message
      appendTo: '.message-list'
    messageForm:
      class: hs.t.MessageForm
      appendTo: '.message-form'


  postRender: ->
    this.messageFormTmpl null, convo: this.options.convo, listing: this.options.listing


  addModel: (id, index) ->
    zz.data.message id, (msg) =>
      this.messageTmpl msg, {nthChild: index}


  removeModel: (id, index) ->
    this.removeTmpl index
