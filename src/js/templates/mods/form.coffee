
dep.require 'hs.Template'
dep.require 'hs.formFields'

dep.provide 'hs.t.mods.form'


hs.t.mods.form = (Template) ->

  Template.prototype.fields ||= []


  oldInit = Template.prototype.modInit
  Template.prototype.modInit = ->
    oldInit.call(this)

    this.on 'postRender', => this._renderFields()


  Template.prototype.renderFields = -> '<span class="formFields"></span>'


  Template.prototype._renderFields = ->
    this._fields = {}

    for fieldOpts in this.fields then do (fieldOpts) =>

      if not hs.formFields[fieldOpts.type]?
        throw new Error 'invalid field type '+fieldOpts.type

      Field = hs.formFields[fieldOpts.type].t

      fieldOpts.appendTo = "##{this.id} .formFields"
      fieldOpts.id = "#{this.id}_#{fieldOpts.name}Field"

      field = new Field null, fieldOpts

      this._fields[fieldOpts.name] = field
      this.templates[fieldOpts.name] ||= []
      this.templates[fieldOpts.name].push field

    this.emit 'postFormRender'
