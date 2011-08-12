
dep.require 'hs.View'

dep.provide 'hs.v.mods.dialog'


hs.v.mods.dialog = (View) ->
  console.log 'dialog mod for view ', View.getName()

  stop = (e) -> e.stopPropagation()

  oldInit = View.prototype.modInit
  View.prototype.modInit = ->
    oldInit.call(this)
    console.log 'dialog init for view ', View.getName()


    if this.options.focusSelector?
      this.focusSelector = this.options.focusSelector

    if not this.focusSelector?
      throw new Error 'Cannot create dialog with no focusSelector.'

    if not this.template.el
      throw new Error 'cannot creator a dialog without a template element'

    this.blur = _.bind this.blur, this

    console.log 'adding dialog class'
    this.template.el.addClass('dialog')
    this.template.el.click stop

    this.template.on 'preRemove', =>
      $('body').unbind('click', this.blur)
      $(this.focusSelector).unbind('click mousedown')

    this._setFocus()


  View.prototype._setFocus = ->
    $(this.focusSelector).one 'mousedown', =>
      $(this.focusSelector).one 'click', stop
      this.focus.apply this, arguments


  View.prototype._setBlur = ->
    $('body').one 'click', this.blur


  View.prototype.focus = ->
    $('body').click()
    this.template.el.addClass('open').show()
    $(this.focusSelector).addClass('open')
    this._setBlur()


  View.prototype.blur = ->
    this.template.el.hide().removeClass('open')
    $(this.focusSelector).removeClass('open')
    this._setFocus()
