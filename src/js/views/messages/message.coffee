
dep.require 'hs.View'

dep.provide 'hs.v.Message'


class hs.v.Message extends hs.View

  events:
    'click .pub': 'answerPublicly'


  answerPublicly: ->
    this.parent.answerPublicly this.template.model.message

