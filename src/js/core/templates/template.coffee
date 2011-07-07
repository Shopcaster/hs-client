
class DOM

  toString: ->
    'Base Template'



class Mine extends DOM

  template: ->
    h1 -> 'Hello Templates'
    span class: 'name'

  creator: (creator) ->
    this.$('.name').text creator.name
