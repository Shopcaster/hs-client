
dep.require 'hs.Template'

dep.provide 'hs.t.MyOffer'

class hs.t.MyOffer extends hs.Template

  template: -> span()

  setAmount: ->
    animate = this.el.text() != ''

    this.el.text "$#{offers[0].amount}"

    if animate
      oldColor = this.el.css 'color'
      this.el.animate {color: '#828200'}, 250, () =>
        this.el.animate {color: oldColor}, 250
