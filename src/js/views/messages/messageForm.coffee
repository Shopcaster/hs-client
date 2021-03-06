
dep.require 'hs.View'
dep.require 'hs.v.mods.form'
dep.require 'hs.v.mods.authForm'
dep.require 'hs.v.mods.dialog'

dep.provide 'hs.v.MessageForm'


class hs.v.MessageForm extends hs.View


  events:
    'click .cancel': 'removePublicly'


  answerPublicly: (question) ->
    this.removePublicly()

    this.options.question = question
    this.template.el.addClass 'question'

    this.template.$('[name=question]')
      .before('<div class="qa">Q:</div>')
      .val(question)
      .parent().show()

    this.template.$('[name=message]')
      .before('<div class="qa">A:</div>')

    this.template.$('[type=submit]')
      .after('<a href="javascript:;" class="cancel">cancel</a>')

    this.registerDomEvents true


  removePublicly: ->
    this.options.question = undefined
    this.template.el.removeClass 'question'
    this.template.$('.qa').remove()
    this.template.$('.cancel').hide()
    this.template.$('br').remove()
    this.template.$('[name=question]').val('').parent().hide()


  validateMessage: (clbk) -> clbk this.get('message').length > 0, 'A message is required'


  createMessage: (convo, clbk) ->
    console.log 'createMessage'
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
            # this line should be deleted pending the fix of:
            #   https://www.pivotaltracker.com/story/show/16308701
            zz.data.convo convoId, =>
              this.submit =>
                this.template.parent.newConvo?()
                clbk?()



hs.v.mods.form hs.v.MessageForm
hs.v.mods.authForm hs.v.MessageForm
