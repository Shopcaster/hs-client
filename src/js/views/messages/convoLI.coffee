
dep.require 'hs.View'

class hs.v.ConvoLI extends hs.View

  events:
    'click': 'openConvo'

  openConvo: ->
    this.template.convoTmpl this.template.model
