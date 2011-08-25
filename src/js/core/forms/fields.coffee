
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
    if not value? and not this.options.nullable
      return 'This field is required'

    else
      return null



reg 'text', 'password', 'email', 'number', {
  t: class InputT extends hs.FormFieldTemplate

    template: ->
      attrs = name: this.options.name, type: this.options.type
      attrs.class = this.options.clas if this.options.clas?
      attrs.value = this.options.value if this.options.value?
      attrs.placeholder = this.options.placeholder if this.options.placeholder?
      attrs.maxlength = this.options.maxlength if this.options.maxlength?

      op = ''
      op += '<div class="'+this.options.name+'-wrap field-wrap"'
      op += ' style="display:none"' if this.options.hide? and this.options.hide
      op += '>'
      op += '<input '
      for key, val of attrs
        op += "#{key}='#{val}' "
      op += '/>'
      op += '</div>'

      return op

  v: class InputV extends hs.FormFieldView

    get: () -> this.template.$('input').val()
    set: (value) -> this.template.$('input').val value
}


reg 'file', {
  t: class FileT extends hs.FormFieldTemplate

    template: ->
      attrs = name: this.options.name, type: this.options.type
      attrs.class = this.options.clas if this.options.clas?
      attrs.style = 'display:none' if this.options.hide? and this.options.hide
      attrs.type = 'file'

      op = '<div class="'+this.options.name+'-wrap field-wrap">'
      op += '<input '
      for key, val of attrs
        op += "#{key}='#{val}' "
      op += '/>'
      op += '</div>'

      return op

  v: class FileV extends hs.FormFieldView

    get: () -> this.template.$('input').val()
    set: (value) -> this.template.$('input').val value
}


reg 'textarea', {
  t: class TextareaT extends hs.FormFieldTemplate

    template: ->
      attrs = name: this.options.name
      attrs.class = this.options.clas if this.options.clas?
      attrs.placeholder = this.options.placeholder if this.options.placeholder?
      attrs.maxlength = this.options.maxlength if this.options.maxlength?
      attrs.style = 'display:none' if this.options.hide? and this.options.hide

      op = '<div class="'+this.options.name+'-wrap field-wrap"><textarea '
      for key, val of attrs
        op += "#{key}='#{val}' "
      op += '></textarea></div>'

      return op


  v: class TextareaV extends hs.FormFieldView
    get: () -> this.template.$('textarea').val()
    set: (value) -> this.template.$('textarea').val value
}


reg 'image', {
  t: class ImageT extends hs.FormFieldTemplate

    template: ->
      attrs = {}
      attrs.class = this.options.clas if this.options.clas?
      attrs.style = 'display:none' if this.options.hide? and this.options.hide

      op = '<div class="'+this.options.name+'-wrap field-wrap"><div '
      for key, val of attrs
        op += "#{key}='#{val}' "
      op += '>'

      op += "<input type='file' name='#{name} />
        <span class='drop'>Drag files here</span></div>"

      return op


  v: class ImageV extends hs.FormFieldView

    get: () -> this.template.$('input').val()
    set: (value) -> this.template.$('input').val value
}
