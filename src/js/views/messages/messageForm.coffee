
dep.require 'hs.View'
dep.require 'hs.v.mods.form'
dep.require 'hs.v.mods.authForm'
dep.require 'hs.v.mods.dialog'

dep.provide 'hs.v.MessageForm'


class hs.v.MessageForm extends hs.View

  submit: (clbk) ->
    if this.options.convo?
      zz.create.message
        message: this.get('message')
        convo: this.options.convo._id
        =>
          this.clear()
          clbk?()

      if this.options.question?
        zz.data.listing this.options.convo.listing, (listing) =>

          zz.create.inquiry
            listing: listing
            question: this.get 'question'
            answer: this.get 'message'
            =>
              this.$('#question').hide()
              this.options.question = null

    else
      console.log 'MessageForm creating cono'
      zz.create.convo listing: this.options.listing, (convoId) =>
        zz.data.convo convoId, (convo) =>
          this.options.convo = convo
          this.submit =>
            this.parent.template.newConvo()



hs.v.mods.form hs.v.MessageForm
hs.v.mods.authForm hs.v.MessageForm
