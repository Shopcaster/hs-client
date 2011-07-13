
dep.require 'zz'
dep.require 'hs'

dep.provide 'hs.View'

hs.v = {}

class hs.View

  constructor: (@template, @options) ->
    this._registerEvents()


  _registerEvents: ->
    return if not this.events?

    for pattern, methodName of this.events
      pattern = pattend.split(' ')
      event = pattern.shift()
      selector = pattern.join(' ')

      if selector.length > 0
        node = this.template.$(selector)

      else
        node = this.template.el

      node.bind event, =>
        this[method].apply(this, arguments)



