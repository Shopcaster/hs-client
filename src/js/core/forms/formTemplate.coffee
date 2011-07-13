
dep.require 'hs.Template'
dep.require 'hs.formFields'

dep.provide 'hs.FormTemplate'

class hs.FormTemplate extends hs.Template

  fields: {}

  _renderFields: () ->
    for fieldOpts in this.fields

      Class = hs.formFields[fieldOpts.type].t
      break if not Class?

      fieldsOpts.appendTo = "##{this.el.attr('id')} .formFields"

      field = new Class null, fieldOpts

      this.fields[fieldOpts.name] = field
      this.templates.push field


  templateContext: _.extend({}, hs.Template,
    fields: (opts) ->
      opts.class = 'formFields'
      span.apply this, opts
  )

  render: ->
    this.preRender?()

    this._renderTemplate()
    this._insertTemplate()
    this._renderFields()
    this._listenOnModel()

    this.postRender?()


