
dep.require 'hs.View'

dep.provide 'hs.v.TopBar'


class hs.v.TopBar extends hs.View

  events:
    'click .logout': 'logout'


  logout: -> zz.auth.deauth()


