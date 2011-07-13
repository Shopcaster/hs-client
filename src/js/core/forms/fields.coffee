
dep.require 'hs.Template'

dep.provide 'hs.formFields'

hs.formFields = {}

reg = (fields..., handlers)->
  for field in fields
    hs.formFields[field] = handlers


class hs.FormFieldTemplate extends hs.Template

class hs.FormFieldView extends hs.View

  get: () -> this.template.$ '.'+this.template.options.name

  set: (value) -> this.get().val value


reg 'text', 'password', 'email', {
  t: class InputT extends hs.FormFieldTemplate

    template: ->
      input
        id: this.options.name
        name: this.options.name
        type: this.options.type
        class: this.options.class
        placeholder: this.options.placeholder
        , (attr) ->
          if this.options.hide then attr.style = 'display:none'

  v: hs.FormFieldView
}



reg 'textarea', {
  t: class TextareaT extends hs.FormFieldTemplate

    template: ->
      textarea
        id: this.options.name
        name: this.options.name
        class: this.options.class
        placeholder: this.options.placeholder
        , (attr) ->
          if this.options.hide then attr.style = 'display:none'

  v: hs.FormFieldView
}
