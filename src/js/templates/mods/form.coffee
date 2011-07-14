
dep.require 'hs.Template'

dep.provide 'hs.mods.t.form'


hs.mods.t.form = (Template) ->

  Template.prototype.fields ||= []


  oldInit = Template.prototype.modInit
  Template.prototype.modInit = ->
    oldInit.call(this)
    this.on 'postRender', => this._renderFields()


  Template.prototype._renderFields = () ->
    for fieldOpts in this.fields then do (fieldOpts) =>

      Field = hs.formFields[fieldOpts.type].t
      return if not Field?

      fieldOpts.appendTo = "##{this.el.attr('id')} .formFields"

      field = new Field null, fieldOpts

      this.fields[fieldOpts.name] = field
      this.templates.push field

    this.emit 'postFormRender'
