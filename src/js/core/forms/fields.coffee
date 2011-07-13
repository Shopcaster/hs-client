
dep.require 'hs.Template'

dep.provide 'hs.formFields'

hs.formFields = {}

reg = (fields..., template)->
  for field in fields
    hs.formFields[field] = template



class hs.FormField extends hs.Template



reg 'text', 'password', 'email', class input extends hs.FormField

  template: ->
    input
      id: this.options.name
      name: this.options.name
      type: this.options.type
      class: this.options.class
      placeholder: this.options.placeholder
      , (attr) ->
        if this.options.hide then attr.style = 'display:none'



reg 'textarea', class textarea extends hs.FormField

  template: ->
    textarea
      id: this.options.name
      name: this.options.name
      class: this.options.class
      placeholder: this.options.placeholder
      , (attr) ->
        if this.options.hide then attr.style = 'display:none'

