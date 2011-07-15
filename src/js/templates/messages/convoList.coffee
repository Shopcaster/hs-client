
dep.require 'hs.Template'
dep.require 'hs.t.ConvoLI'

dep.provide 'hs.t.ConvoList'

class hs.t.ConvoList extends hs.Template

  template: ->
    div class: 'convo-list'


  subTemplates:
    convoLI:
      class: hs.t.ConvoLI
      appendTo: '.convo-list'


  addModel: (convo, index) ->
    this.convoLITmpl convo, {nthChild: index}


  removeModel: (id, index) ->
    this.removeTmpl index




