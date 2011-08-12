
dep.require 'hs'
dep.require 'zz.models'
dep.require 'hs.EventEmitter'

dep.provide 'hs.Template'

constructorId = 0


class hs.Template extends hs.EventEmitter

  injected: false
  _meta: []
  initListeners: []
  modInit: ->

  constructor: (@model, @options = {}) ->

    this.emit('preConstructor')
    this._moveOptions()
    this._setupTemplates()
    this.modInit()
    this._init()
    this.emit('postConstructor')


  _moveOptions: ->
    if this.options.prependTo? then this.prependTo = this.options.prependTo
    if this.options.appendTo? then this.appendTo = this.options.appendTo
    if this.options.nthChild? then this.nthChild = this.options.nthChild
    if this.options.parent? then this.parent = this.options.parent
    if this.options.authRequired? then this.authRequired = this.options.authRequired

    if this.options.id?
      this.id = this.options.id

    else if not this.id?
      this.id = this.constructor.getName() + ''
      this.id = this.parent.id + '_' + this.id if this.parent?

      if this.model?._id?
        this.id += "-#{this.model._id}"

      this.id = this.id.toLowerCase().replace '/', ''

    return this.id


  _init: ->
    if this.init?
      this.init => this.render()
    else
      this.render()


  _setupTemplates: ->
    if this.templates?
      throw new Error '_setupTemplates should only be called once'

    this.templates = {}
    for name, classOpts of this.subTemplates then do (name, classOpts) =>

      method = "#{name}Tmpl"
      className = classOpts.class.name

      this[method] = (model, instOpts) =>
        opts = _.extend {parent: this}, classOpts, instOpts

        tmpl = new classOpts.class model, opts

        this.templates[className] ||= []
        if not opts.nthChild?
          this.templates[className].push tmpl
        else
          this.templates[className].splice opts.nthChild, 0, tmpl

        this.emit 'subTemplateAdd', className, tmpl, opts.nthChild

        return tmpl

      this[method].remove = () =>
        return if not this.templates[className]?

        tmpl.remove() for tmpl, i in this.templates[className]

        this.templates[className] = []
        this.emit 'subTemplateRemove', className, i


  removeTmpl: (className, index) ->
    if not this.templates[className]?[index]?
      throw new Error 'Invalid sub-template index'

    this.templates[className][index].remove()
    this.templates[className].splice index, 1

    this.emit 'subTemplateRemove', className, index


  _renderTemplate: ->
    this.el = $ "##{this.id}"

    if this.alwaysFresh and this.el.length > 0
      this.el.remove()
      this.el = []

    if this.el.length == 0
      if typeof this.template == 'string'
        html = this.template

      else
        html = this.template()

      this.el = $(html)
      this.el.attr 'id', this.id

    else
      this.injected = true

    this.$ = (selector) => $ selector, this.el


  _insertTemplate: ->
    return if this.injected

    if this.appendTo?
      if not this.nthChild?
        $(this.appendTo).append this.el

      else
        children = $(this.appendTo).children()
        if this.nthChild == 0
          $(this.appendTo).prepend this.el
        else
          $(children[this.nthChild - 1]).after this.el

      this.injected = true

    else if this.prependTo?
      $(this.prependTo).prepend this.el
      this.injected = true


  _listenOnModel: ->
    if this.model?
      if this.options.heat != false
        this.model.heat()

      this.modelInit = true

      if this.model instanceof Array #model list

        if this.sort?
          this.model.sort this.sort

        if this.addModel?
          this.model.on 'add', => this.addModel.apply this, arguments

        if this.removeModel?
          this.model.on 'remove', => this.removeModel.apply this, arguments

        for m, i in this.model
          this.addModel m, i

      else

        for own field of this.model
          method = 'set'+ field.charAt(0).toUpperCase() + field.slice(1)

          if this[method]?
            this.model.on field, do (method) => => this[method].apply this, arguments
            this[method] this.model[field]

      this.modelInit = false


  render: ->
    this.emit('preRender')
    this.preRender?()

    this._renderTemplate()
    this._insertTemplate()
    this._listenOnModel()

    this.postRender?()
    this.emit('postRender')


  meta: (props) ->
    meta = $ '<meta>'

    for key, val of props
      meta.attr key, val

    this._meta.push meta


  _removeMeta: -> meta.remove() for meta in this._meta


  authChange: (prev, cur) ->
    this.setAuth?(prev, cur)
    this.emit 'setAuth', prev, cur
    for name, templates of this.templates
      for tmpl in templates
        tmpl.authChange prev, cur


  remove: ->
    this.emit('preRemove')
    this.preRemove?()

    for name, templates of this.templates
      for tmpl in templates
        tmpl.remove()

    this.el?.remove()
    this._removeMeta()

    if this.options.heat != false
      if this.model?
        this.model.freeze()

    this.postRemove?()
    this.emit('postRemove')


hs.util


hs.Template.get = (options, clbk) ->
  console.log 'Template.get'
  user = zz.auth.curUser()
  if this.getModel?
    console.log 'getting model'
    this.getModel options, (model) =>
      console.log 'got model ', model
      return clbk null if not model?
      console.log 'model exists'
      template = new this(model, options)
      console.log 'template instantiated'
      template.authChange null, user
      console.log 'Template.get clbk'
      clbk template
  else
    template = new this(null, options)
    template.authChange null, user
    console.log 'Template.get clbk'
    clbk template
