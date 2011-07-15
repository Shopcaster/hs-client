
dep.require 'hs'

dep.provide 'hs.v.mods.form'


hs.v.mods.form = (View) ->

  View.prototype.events ||= {}
  View.prototype.fields = {}


  _.extend View.prototype.events,
    'submit': '_submit'


  oldInit = View.prototype.modInit
  View.prototype.modInit = ->
    oldInit.call(this)

    for fieldOpts in this.template.fields

      View = hs.formFields[fieldOpts.type].v
      break if not View?

      field = new View this.template.fields[fieldOpts.name], fieldOpts

      this.fields[fieldOpts.name] = field


  View.prototype._validate = (clbk) ->
    fields = _.keys this.fields

    do next = =>
      name = fields.pop()

      return clbk true if not name?

      field = this.fields[name]

      if not field.valid()
        this.showInvalid name
        return clbk false

      validator = 'validate'+name.charAt(0).toUpperCase() + name.slice(1)

      if this[validator]?
        this[validator] (valid) =>
          if not valid
            this.showInvalid name
            return clbk false

          else
            next()

      else
        next()


  View.prototype._submit = (e) ->
    e.preventDefault()
    this._validate (valid) =>
      this.submit?.apply(this, arguments) if valid


  View.prototype.get = (fieldname) ->
    this.fields[fieldname].get()


  View.prototype.set = (fieldname, value) ->
    this.fields[fieldname].set(value)


  View.prototype.clear = () -> field.set('') for name, field of this.fields


  View.prototype.showInvalid = (name) ->
    node = this.template.$ '[name="'+name+'"]'
    oldColor = node.css 'backgroundColor'

    node.animate backgroundColor: '#c33', 200, =>
      node.one 'focus', => node.css backgroundColor: oldColor

