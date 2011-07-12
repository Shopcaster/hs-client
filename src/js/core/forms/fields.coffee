
dep.require 'hs.Template'

hs.formFields = {}

reg = (fields..., template)->
  for field in fields
    hs.formFields[field] = template


reg 'text', 'password', 'email', class input extends hs.Template

  template: ->
