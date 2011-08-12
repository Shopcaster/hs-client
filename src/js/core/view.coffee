
dep.require 'zz.models'
dep.require 'hs.Template'
dep.require 'hs.EventEmitter'

dep.provide 'hs.View'


class hs.View extends hs.EventEmitter

  initListeners: []
  modInit: ->

  constructor: (@template, @options = {}) ->
    this.views = {}

    console.log 'modInit', this.constructor.getName(), this.modInit
    this.modInit()

    this._moveOptions()
    this.registerDomEvents()
    this._registerTmplEvents()
    this._subViewsStart()

    this.init?()


  _moveOptions: ->
    if this.options?
      if this.options.parent? then this.parent = this.options.parent


  registerDomEvents: (remove) ->
    return if not this.events?

    events = _.map this.events, (methodName, pattern, memo) =>
      pattern = pattern.split(' ')
      event = pattern.shift()
      selector = pattern.join(' ')

      if selector.length > 0
        node = this.template.$(selector)

      else
        node = this.template.el

      return [methodName, event, node]


    if remove
      for [methodName, event, node] in events
        node.unbind event

    for [methodName, event, node] in events
      node.bind event, _.bind(this[methodName], this)


  _registerTmplEvents: ->
    this.template.on 'subTemplateAdd', _.bind this._subViewAdd, this
    this.template.on 'subTemplateRemove', _.bind this._subViewRemove, this

    this.template.on 'preRemove', _.bind(this.preRemove, this) if this.preRemove?
    this.template.on 'postRemove', _.bind(this.postRemove, this) if this.postRemove?


  _subViewsStart: ->
    for name, tmpls of this.template.templates
      for tmpl in tmpls
        this._subViewAdd name, tmpl


  _subViewAdd: (className, tmpl, i) ->
    View = hs.v[className] or hs.View

    options = _.extend {}, tmpl.options, {parent: this}

    view = new View tmpl, options

    this.views[className] ||= []

    if not i?
      this.views[className].push view

    else
      this.views[className].splice i, 0, view


  _subViewRemove: (className, i) -> this.views[className].splice i, 1


  remove: ->

