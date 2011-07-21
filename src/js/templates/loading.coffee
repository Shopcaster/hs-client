
dep.require 'hs.Template'

dep.provide 'hs.t.Loading'


class hs.t.Loading extends hs.Template

  appendTo: 'body'
  id: 'loading'

  template: ->
    div ->
      img src: '/img/spinner.gif'
      text 'Loading...'

