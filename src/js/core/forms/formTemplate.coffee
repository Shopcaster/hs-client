
dep.require 'hs.Template'
dep.require 'hs.formFields'

dep.provide 'hs.FormTemplate'

class hs.FormTemplate extends hs.Template

  _renderFields: () ->
    for fieldOpts in this.fields

      Class = hs.formFields[fieldOpts.type]
      break if not Class?

      fieldsOpts.appendTo '##{this.el.attr("id")} .formFields'

      this.templates.push new Class null, fieldOpts


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


