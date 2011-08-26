
dep.require 'hs.Template'

dep.provide 'hs.t.Notifications'


class hs.t.Notifications extends hs.Template

  appendTo: 'body'
  id: 'notifications'
  template: -> '<div></div>'
