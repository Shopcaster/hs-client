
dep.require 'hs.View'

dep.provide 'hs.v.e403'

class hs.v.e403 extends hs.View

  init:-> setTimeout (-> hs.emit 'openLogin'), 200
