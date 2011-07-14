
dep.require 'hs.View'

dep.provide 'hs.mods.v.dialog'

hs.mods.v.dialog = (View) ->

  stop = (e) -> e.stopPropagation()

  oldInit = View.prototype.modInit
  View.prototype.modInit = ->
    oldInit.call(this)

    if this.options.focusSelector?
      this.focusSelector = this.options.focusSelector

    if not this.focusSelector?
      throw new Error 'Cannot create dialog with no focusSelector.'

    this._dialogSetMousedown()
    this.blur = _.bind this.blur, this

    this.template.el.addClass('dialog')
    this._dialogSetBlur()


  View.prototype._dialogSetMousedown = ->
    $(this.focusSelector).one 'mousedown', =>
      $(this.focusSelector).one 'click', stop
      this.focus.apply this, arguments


  View.prototype._dialogSetBlur = ->
    $('body').click(this.blur)
    this.template.el.click stop


  View.prototype.focus = ->
    this.blurAllElse()
    this.template.el.addClass('open').show()
    $(this.focusSelector).addClass('open')


  View.prototype.blur = ->
    this.template.el.hide().removeClass('open')
    $(this.focusSelector).removeClass('open')
    this._dialogSetMousedown()


  View.prototype.blurAllElse = ->
    $('body').unbind('click', this.blur).click().bind('click', this.blur)



