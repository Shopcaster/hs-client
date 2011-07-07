
class View


hs.View = View


class MyView extends hs.View

  dom: MyDom

  events:
    'click .button': 'handler'

  hander: ->
    this.dom.$('.button').text 'clicked'
