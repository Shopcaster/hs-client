
dep.require 'hs.Template'
dep.require 'hs.View'

dep.provide 'hs.formFields'

hs.formFields = {}

reg = (fields..., handlers)->
  for field in fields
    hs.formFields[field] = handlers


class hs.FormFieldTemplate extends hs.Template

  constructor: (@model, @options) ->
    this.id = this.constructor.getName()+this.options.name
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
      attrs = name: this.options.name, type: this.options.type
      attrs.class = this.options.clas if this.options.clas?
      attrs.placeholder = this.options.placeholder if this.options.placeholder?
      attrs.maxlength = this.options.maxlength if this.options.maxlength?
      attrs.style = 'display:none' if this.options.hide? and this.options.hide

      op = '<input '
      for key, val of attrs
        op += "#{key}='#{val}' "
      op += '/>'

      return op

  v: class InputV extends hs.FormFieldView
}


reg 'file', {
  t: class FileT extends hs.FormFieldTemplate

    template: ->
      attrs = name: this.options.name, type: this.options.type
      attrs.class = this.options.clas if this.options.clas?
      attrs.style = 'display:none' if this.options.hide? and this.options.hide
      attrs.type = 'file'

      op = '<input '
      for key, val of attrs
        op += "#{key}='#{val}' "
      op += '/>'

      return op

  v: class FileV extends hs.FormFieldView
}


reg 'textarea', {
  t: class TextareaT extends hs.FormFieldTemplate

    template: ->
      attrs = name: this.options.name
      attrs.class = this.options.clas if this.options.clas?
      attrs.placeholder = this.options.placeholder if this.options.placeholder?
      attrs.maxlength = this.options.maxlength if this.options.maxlength?
      attrs.style = 'display:none' if this.options.hide? and this.options.hide

      op = '<textarea '
      for key, val of attrs
        op += "#{key}='#{val}' "
      op += '></textarea>'

      return op

  v: hs.FormFieldView
}


reg 'image', {
  t: class ImageT extends hs.FormFieldTemplate

    template: ->
      attrs = {}
      attrs.class = this.options.clas if this.options.clas?
      attrs.style = 'display:none' if this.options.hide? and this.options.hide

      op = '<div '
      for key, val of attrs
        op += "#{key}='#{val}' "
      op += '>'

      op += "<input type='file' name='#{name} />
        <span class='drop'>Drag files here</span>"

      return op


  v: class ImageV extends hs.FormFieldView

    get: () -> this.template.el.val()

    set: (value) -> this.template.el.val value

    valid: () ->
      value = this.get()
      return value? or this.options.nullable

}
