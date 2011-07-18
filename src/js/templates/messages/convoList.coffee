
dep.require 'hs.Template'
dep.require 'hs.t.ConvoLI'

dep.provide 'hs.t.ConvoList'

class hs.t.ConvoList extends hs.Template

  template: ->
    div class: 'convo-list', -> h2 'Buyer Messages'


  subTemplates:
    convoLI:
      class: hs.t.ConvoLI
      appendTo: '.convo-list'


  addModel: (convo, index) ->
    index = undefined if index == -1
    this.convoLITmpl convo, {nthChild: index}


  removeModel: (id, index) ->
    this.removeTmpl index




