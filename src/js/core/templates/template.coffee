
class Dom

  updateAuth: (prev, cur) -> return

hs.Dom = Dom


class MyDom extends hs.Dom

  template: ->
    h1 -> 'Hello Templates'
    span class: 'name'

  setCreator: (creator) ->
    this.$('.name').text creator.name



