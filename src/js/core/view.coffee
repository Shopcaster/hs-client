
dep.require 'zz.models'
dep.require 'hs.Template'
dep.require 'hs.EventEmitter'

dep.provide 'hs.View'


class hs.View extends hs.EventEmitter

  initListeners: []
  views: {}
  modInit: ->

  constructor: (@template, @options) ->
    this.modInit()

    this._registerDomEvents()
    this._registerTmplEvents()
    this._subViewsStart()


  _registerDomEvents: ->
    return if not this.events?

    for pattern, methodName of this.events then do (pattern, methodName) =>
      pattern = pattern.split(' ')
      event = pattern.shift()
      selector = pattern.join(' ')

      if selector.length > 0
        node = this.template.$(selector)

      else
        node = this.template.el

      console.log 'binding', this.template.id, event, methodName
      node.bind event, =>
        this[methodName].apply(this, arguments)


  _registerTmplEvents: ->
    this.template.on 'subTemplateAdd', _.bind this._subViewAdd, this
    this.template.on 'subTemplateRemove', _.bind this._subViewRemove, this


  _subViewsStart: ->
    for name, tmpls of this.template.templates
      for tmpl in tmpls
        this._subViewAdd name, tmpl


  _subViewAdd: (className, tmpl, i) ->
    View = hs.v[className] or hs.View

    view = new View tmpl, tmpl.options

    this.views[className] ||= []

    if not i?
      this.views[className].push view

    else
      this.views[className].splice i, 0, view


  _subViewRemove: (className, i) -> this.views[className].splice i, 1


  remove: ->

