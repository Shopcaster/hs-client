
dep.require 'hs'
dep.require 'CoffeeKup'
dep.require 'zz.models'
dep.provide 'hs.Template'

hs.t = {}

class hs.Template

  templateContext: {}
  injected: false
  _meta: []

  constructor: (@model, @options = {}) ->
    this._moveOptions()
    this._setupTemplates()
    this._init()


  _moveOptions: ->
    if this.options.prependTo? then this.prependTo = this.options.prependTo
    if this.options.appendTo? then this.appendTo = this.options.appendTo
    if this.options.nthChild? then this.nthChild = this.options.nthChild

    if this.options.id?
      this.id = this.options.id

    else if not this.id?
      this.id = this.constructor.name

      if this.model?._id?
        this.id += "-#{this.model._id}"


  _init: ->
    if this.init?
      this.init => this.render() unless this.options.unRendered
    else
      this.render() unless this.options.unRendered


  _setupTemplates: ->
    if this.templates?
      throw new Error '_setupTemplates should only be called once'

    this.templates = []
    for name, classOpts of this.subTemplates
      do (name, classOpts) =>

        method = "#{name}Tmpl"

        this[method] = (model, instOpts) =>
          opts = _.extend {}, classOpts, instOpts
          tmpl = new classOpts.class model, opts

          if not opts.nthChild?
            this.templates.push tmpl

          else
            this.templates.splice opts.nthChild, 1, tmpl

        this[method].remove = () =>
          for tmpl, i in this.templates
            if tmpl.constructor.name == name
              tmpl.remove()
              this.templates.splice i, 1


  removeTmpl: (index) ->
    if not this.templates[index]?
      throw new Error 'Invalid sub-template index'

    this.templates[index].remove()
    this.templates.splice index, 1


  _renderTemplate: ->
    this.el = $ "##{this.id}"

    if this.el.length == 0
      html = CoffeeKup.render(this.template, context: this.templateContext)
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
        $("#{this.appendTo}:nth-child(#{this.nthChild})").after this.el

      this.injected = true

    else if this.prependTo?
      $(this.prependTo).prepend this.el
      this.injected = true


  _listenOnModel: ->
    if this.model?
      this.model.heat()

      if _.isArray this.model #model list
        if this.addModel?
          this.model.on 'add', => this.addModel.apply this, arguments
        if this.removeModel?
          this.model.on 'remove', => this.removeModel.apply this, arguments

      else
        for own field of this.model
          method = 'set'+ field.charAt(0).toUpperCase() + field.slice(1)

          if this[method]?
            this.model.on field, => this[method].apply(this, arguments)
            this[method] this.model[field]


  render: ->
    this.preRender?()

    this._renderTemplate()
    this._insertTemplate()
    this._listenOnModel()

    this.postRender?()


  meta: (props) ->
    meta = $ '<meta>'

    for key, val of props
      meta.attr key, val

    this._meta.push meta


  _removeMeta: -> meta.remove() for meta in this._meta


  authChange: (prev, cur) ->
    this.setAuth?()
    tmpl.authChange prev, cur for tmpl in this.templates


  remove: ->
    this.preRemove?()

    sub.remove() for sub in this.templates

    this.el?.remove()
    this.el = null
    this.$ = null
    this._removeMeta()
    this.model?.freeze()

    this.postRemove?()


hs.Template.get = (options, clbk) ->
  if this.getModel?
    this.getModel options, (model) =>
      clbk new this(model, options)
  else
    clbk new this(null, options)
