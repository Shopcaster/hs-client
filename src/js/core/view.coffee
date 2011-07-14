
dep.require 'zz.models'
dep.require 'hs.Template'
dep.require 'hs.EventEmitter'

dep.provide 'hs.View'

hs.v = {}

class hs.View extends hs.EventEmitter

  initListeners: []
  views: []
  modInit: ->

  constructor: (@template, @options) ->
    this.modInit()

    this._registerDomEvents()
    this._registerTmplEvents()
    this._subViewsStart()


  _registerDomEvents: ->
    return if not this.events?

    for pattern, methodName of this.events
      pattern = pattern.split(' ')
      event = pattern.shift()
      selector = pattern.join(' ')

      if selector.length > 0
        node = this.template.$(selector)

      else
        node = this.template.el

      node.bind event, =>
        this[methodName].apply(this, arguments)


  _registerTmplEvents: ->
    this.template.on 'subTemplateAdd', _.bind this._subViewAdd, this
    this.template.on 'subTemplateRemove', _.bind this._subViewRemove, this


  _subViewsStart: ->
    this._subViewAdd tmpl for tmpl in this.template.templates


  _subViewAdd: (tmpl, i) ->
    View = hs.v[tmpl.constructor.name] or hs.View

    view = new View tmpl, tmpl.options

    if not i?
      this.views.push view

    else
      this.views.splice i, 1, view


  _subViewRemove: (i) -> this.views.splice i, 1

