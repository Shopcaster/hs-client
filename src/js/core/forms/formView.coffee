
dep.require 'hs.View'

dep.provide 'hs.FormView'

class hs.FormView extends hs.View

  events: 'submit form': '_submit'
  fields: {}


  _initFields: ->
    for fieldOpts in this.template.fields

      View = hs.formFields[fieldOpts.type].v
      break if not View?

      field = new Class this.template.fields[fieldOpts.name], fieldOpts

      this.fields[fieldOpts.name] = field


  _submit: ->
    this.submit?.apply(this, arguments)


  get: (fieldName) ->
    this.fields[fieldname].get()


  set: (fieldName, value) ->
    this.fields[fieldname].set(value)
