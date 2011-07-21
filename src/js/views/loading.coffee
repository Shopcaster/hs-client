
dep.require 'hs.View'

dep.provide 'hs.v.Loading'

class hs.v.Loading extends hs.View

  init: ->
    this.waiting = _.bind this.waiting, this
    this.done = _.bind this.done, this

    zz.on 'waiting', this.waiting
    zz.on 'done', this.done


  waiting: -> this.template.el.fadeIn 200


  done: -> this.template.el.fadeOut 200


  preRemove: ->
    zz.removeListener 'waiting', this.waiting
    zz.removeListener 'done', this.done


