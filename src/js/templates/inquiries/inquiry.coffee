
dep.require 'hs.Template'
dep.require 'hs.t.InlineUser'

dep.provide 'hs.t.Inquiry'

class hs.t.Inquiry extends hs.Template

  template: -> """
    <div class="inquiry li">
      <span class="created"></span>
      <div class="question"></div>
      <div class="answer"></div>
      <div class="clicky"></div>
    </div>
    """


  subTemplates:
    user:
      class: hs.t.InlineUser


  setQuestion: ->
    this.$('.question').text "Q: #{this.model.question}"


  setAnswer: ->
    this.$('.answer').text "A: #{this.model.answer}"
