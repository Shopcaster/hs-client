
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

    # only pass if you suck
    return if 'placeholder' in document.createElement('input')

    for name, field of this.fields then do (field)->
      el = field.template.el
      return if not placeholder = el.attr('placeholder')

      el.val placeholder
      el.addClass 'placeheld'

      el.focus ->
        if el.val() == placeholder
          el.val ''
          el.removeClass 'placeheld'

      el.blur ->
        if el.val() == ''
          el.val placeholder
          el.addClass 'placeheld'




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

    if not 'placeholder' in document.createElement('input')
      for name, field of this.fields
        el = field.template.el
        return if not placeholder = el.attr('placeholder')?

        if el.val() == placeholder
          el.val ''
          el.removeClass 'placeheld'


    this._validate (valid) =>
      if valid
        this.submit?.apply(this, arguments)

      else
        if not 'placeholder' in document.createElement('input')
          for name, field of this.fields
            el = field.template.el
            return if not placeholder = el.attr('placeholder')?

            if el.val() == ''
              el.val placeholder
              el.addClass 'placeheld'



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

