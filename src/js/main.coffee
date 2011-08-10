
dep.require 'lib'
dep.require 'util'

dep.provide 'hs'

window.hs = {}
hs.t = {}
hs.v = {}


if window.applicationCache
  window.applicationCache.addEventListener 'updateready', (->
    if window.applicationCache.status == window.applicationCache.UPDATEREADY
      window.applicationCache.swapCache()
      zz.emit 'notification',
        'A new version of Hipsell is available! Refresh the page to update.'
  ), false

# document.head polyfill
document.head || (document.head = document.getElementsByTagName('head')[0]);
