
dep.require 'hs.View'
dep.require 'hs.v.mods.dialog'

dep.provide 'hs.v.ConvoDialog'
dep.provide 'hs.v.Convo'


class hs.v.Convo extends hs.View

  answerPublicly: (question) ->
    this.views.MessageForm[0].answerPublicly(question)



class hs.v.ConvoDialog extends hs.v.Convo
hs.v.mods.dialog hs.v.ConvoDialog
