
dep.require 'hs.Template'
dep.require 'hs.t.MessageForm'
dep.require 'hs.t.Message'

dep.provide 'hs.t.Convo'
dep.provide 'hs.t.ConvoDialog'

class hs.t.Convo extends hs.Template

  template: -> """
    <div class="convo list-box">
      <div class="message-form"></div>
      <div class="message-list"></div>
    </div>
    """


  subTemplates:
    message:
      class: hs.t.Message
      prependTo: '.message-list'
    messageForm:
      class: hs.t.MessageForm
      appendTo: '.message-form'


  sort: (one, two) ->  two.created - one.created


  postRender: ->
    this.messageFormTmpl null,
      listing: this.options.listing
      convo: this.options.convo
      appendTo: "##{this.id} .message-form"


  addModel: (msg, index) ->
    index = undefined if index == -1

    this.messageTmpl msg,
      nthChild: index
      appendTo: "##{this.id} .message-list"


  removeModel: (id, index) ->
    console.log 'removeModel', index
    this.removeTmpl 'Message', index


  newConvo: -> this.parent.newConvo?()


class hs.t.ConvoDialog extends hs.t.Convo
