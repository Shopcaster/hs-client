
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


  addModel: (id, index) ->
    zz.data.convo id, (convo) =>
      this.convoLITmpl convo, {nthChild: index}


  removeModel: (id, index) ->
    this.removeTmpl index




