
dep.require 'hs'
dep.provide 'hs.Template'

hs.t = {}

class hs.Template

  constructor: (@model, @options) ->

    this.templates = []

    for name, classOpts of this.subTemplates
      this["#{name}Tmpl"] = (instOpts) =>
        tmpl = new classOpts.class _.extend {}, classOpts, instOpts
        this.templates.append tmpl


  render: ->
    html = this.template()
    this.el = $(html)
    this.$ = (selector) => $ selector, this.el

    if this.options.appendTo?
      $(this.options.appendTo).append this.el

    else if this.options.prependTo?
      $(this.options.prependTo).prepend this.el

    for own field of this.model
      method = 'set'+ field.charAt(0).toUpperCase() + field.slice(1)
      if this[method]?
        this.model.on field, this[method], this
        this[method] this.model[field]


  remove: ->
    this.el.remove()
    this.el = null
    this.$ = null
    this.model.freeze()


  updateAuth: (prev, cur) -> return
