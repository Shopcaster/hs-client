
dep.require 'hs.View'

dep.provide 'hs.v.Message'


class hs.v.Message extends hs.View

  events:
    'click .pub': 'answerPublicly'


  answerPublicly: ->
    console.log 'Message answerPublicly', this
    this.parent.answerPublicly this.template.model.message

