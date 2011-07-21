
dep.provide 'hs.globalTemplates'

dep.require 'hs.t.TopBar'
dep.require 'hs.t.Notifications'

hs.globalTemplates = [
  hs.t.TopBar,
  hs.t.Notifications,
]
