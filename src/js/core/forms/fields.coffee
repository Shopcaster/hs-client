
dep.require 'hs.Template'
dep.require 'hs.View'

dep.provide 'hs.formFields'

hs.formFields = {}

reg = (fields..., handlers)->
  for field in fields
    hs.formFields[field] = handlers


class hs.FormFieldTemplate extends hs.Template

  constructor: (@model, @options) ->
    this.templateLocals = this.options
    this.id = this.constructor.name+this.options.name
    hs.Template.apply(this, arguments)



class hs.FormFieldView extends hs.View

  get: () -> this.template.el.val()

  set: (value) -> this.template.el.val value

  valid: () ->
    value = this.get()
    return value? or this.options.nullable



reg 'text', 'password', 'email', 'number', {
  t: class InputT extends hs.FormFieldTemplate

    template: ->
      attrs = name: name, type: type
      attrs.class = clas if clas?
      attrs.placeholder = placeholder if placeholder?
      attrs.maxlength = maxlength if maxlength?
      attrs.style = 'display:none' if hide? and hide

      input attrs

  v: class InputV extends hs.FormFieldView
}


reg 'textarea', {
  t: class TextareaT extends hs.FormFieldTemplate

    template: ->
      attrs = name: name
      attrs.class = clas if clas?
      attrs.placeholder = placeholder if placeholder?
      attrs.maxlength = maxlength if maxlength?
      attrs.style = 'display:none' if hide? and hide

      textarea attrs

  v: hs.FormFieldView
}


reg 'image', {
  t: class ImageT extends hs.FormFieldTemplate

    template: ->
      attrs.class = clas if clas?
      attrs.style = 'display:none' if hide? and hide

      div attrs, ->
        input type: 'file', name: name
        span class: 'drop', -> 'Drag files here'


  v: class ImageV extends hs.FormFieldView

    get: () -> this.template.el.val()

    set: (value) -> this.template.el.val value

    valid: () ->
      value = this.get()
      return value? or this.options.nullable

}
