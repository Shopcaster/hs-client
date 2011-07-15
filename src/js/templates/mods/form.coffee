
dep.require 'hs.Template'

dep.provide 'hs.t.mods.form'


hs.t.mods.form = (Template) ->

  Template.prototype.fields ||= []


  oldInit = Template.prototype.modInit
  Template.prototype.modInit = ->
    oldInit.call(this)

    this.on 'postRender', => this._renderFields()

    this.templateLocals.fields = (attrs, clbk) ->
      attrs ||= {}
      attrs.class = 'formFields'
      ck_tag 'span', [attrs, clbk]


  Template.prototype._renderFields = () ->
    for fieldOpts in this.fields then do (fieldOpts) =>

      Field = hs.formFields[fieldOpts.type].t
      return if not Field?

      fieldOpts.appendTo = "##{this.el.attr('id')} .formFields"

      field = new Field null, fieldOpts

      this.fields[fieldOpts.name] = field
      this.templates[fieldOpts.name] ||= []
      this.templates[fieldOpts.name].push field

    this.emit 'postFormRender'
