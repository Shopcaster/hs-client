
dep.require 'hs.View'
dep.require 'hs.v.mods.form'
dep.require 'hs.v.mods.authForm'
dep.require 'hs.v.mods.dialog'

dep.provide 'hs.v.MessageForm'


class hs.v.MessageForm extends hs.View


  answerPublicly: (question) ->
    this.removePublicly()

    this.options.question = question
    this.template.el.addClass 'question'

    this.template.$('[name=question]')
      .before('<div class="qa">Q:</div>')
      .val(question)
      .show()

    this.template.$('[name=message]')
      .before('<br><div class="qa">A:</div>')


  removePublicly: ->
    this.options.question = undefined
    this.template.el.removeClass 'question'
    this.template.$('.qa').remove()
    this.template.$('br').remove()
    this.template.$('[name=question]').val('').hide()


  validateMessage: (clbk) -> clbk this.get('message').length > 0


  createMessage: (convo, clbk) ->
    zz.create.message
      message: this.get('message')
      convo: convo._id
      =>
        this.clear()
        clbk?()
        mpq.push(["track", "create:message", {}]);

    if this.options.question?

      zz.create.inquiry
        listing: this.options.listing
        question: this.get 'question'
        answer: this.get 'message'
        => this.removePublicly()


  submit: (clbk) ->
    if this.options.listing.creator == zz.auth.curUser()?._id
      this.createMessage this.options.convo, clbk

    else
      this.options.listing.myConvo (convo) =>
        if convo?
          this.createMessage convo, clbk
        else
          zz.create.convo listing: this.options.listing, (convoId) =>
            zz.data.convo convoId, (convo) =>
              this.options.convo = convo
              this.submit =>
                this.template.parent.newConvo?()
                clbk?()



hs.v.mods.form hs.v.MessageForm
hs.v.mods.authForm hs.v.MessageForm
