
dep.require 'hs.Template'
dep.require 'hs.t.MessageForm'

dep.provide 'hs.t.Convo'

class hs.t.Convo extends hs.Template

  template: ->
    div class: 'convo', id: "convo-#{this.model._id}", ->
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
    this.messageFormTmpl()


  addModel: (id, index) ->
    zz.data.message id, (msg) =>
      this.messageTmpl msg, {nthChild: index}


  removeModel: (id, index) ->
    this.removeTmpl index
