
dep.require 'hs.View'
dep.require 'hs.v.mods.form'
dep.require 'hs.v.mods.authForm'
dep.require 'hs.v.mods.dialog'

dep.provide 'hs.v.MessageForm'


class hs.v.MessageForm extends hs.View


  answerPublicly: (question) ->
    this.options.question = question
    this.template.$('[name=question]').val(question).show()


  createMessage: (convo, clbk) ->
    console.log 'adding message to convo', convo
    zz.create.message
      message: this.get('message')
      convo: convo._id
      =>
        this.clear()
        clbk?()

    if this.options.question?

      zz.create.inquiry
        listing: this.options.listing
        question: this.get 'question'
        answer: this.get 'message'
        =>
          this.template.$('#question').hide().val('')
          this.options.question = null


  submit: (clbk) ->
    if this.options.listing.creator == zz.auth.curUser()?._id
      this.createMessage this.options.convo, clbk

    else
      this.options.listing.myConvo (convo) =>
        if convo?
          this.createMessage convo, clbk
        else
          console.log 'creating new convo'
          zz.create.convo listing: this.options.listing, (convoId) =>
            zz.data.convo convoId, (convo) =>
              this.options.convo = convo
              this.submit =>
                this.template.parent.newConvo?()
                clbk?()



hs.v.mods.form hs.v.MessageForm
hs.v.mods.authForm hs.v.MessageForm
