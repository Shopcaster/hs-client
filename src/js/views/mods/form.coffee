
dep.require 'hs'

dep.provide 'hs.v.mods.form'


hs.v.mods.form = (View) ->

  View.prototype.events ||= {}


  _.extend View.prototype.events, 'submit': '_submit'


  oldInit = View.prototype.modInit
  View.prototype.modInit = ->
    oldInit.call(this)
    this.fields = {}

    for fieldOpts in this.template.fields

      View = hs.formFields[fieldOpts.type].v
      break if not View?

      field = new View this.template._fields[fieldOpts.name], fieldOpts

      this.fields[fieldOpts.name] = field


  View.prototype._validate = (clbk) ->
    fields = _.keys this.fields

    next = =>
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

    if this.validate?
      this.validate next
    else
      next()


  View.prototype._submit = (e) ->
    e?.preventDefault()
    this._validate (valid) =>
      this.submit?.apply(this, arguments) if valid


  View.prototype._cache = {}
  View.prototype.cache = ->
    for node in this.template.$('[name]')
      node = $(node)
      this._cache[node.attr('name')] = node.val()


  View.prototype.unCache = -> this._cache = {}


  View.prototype.get = (fieldname) ->
    if this._cache?[fieldname]?
      return this._cache[fieldname]
    this.fields[fieldname].get()


  View.prototype.set = (fieldname, value) ->
    this.fields[fieldname].set(value)


  View.prototype.clear = () -> field.set('') for name, field of this.fields


  View.prototype.showInvalid = (name) ->
    this.template.$('[name="'+name+'"]').addClass('formError').one 'keydown change', =>
      this.template.$('[name="'+name+'"]').removeClass('formError')

