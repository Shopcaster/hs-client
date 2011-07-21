
dep.require 'hs.View'

dep.provide 'hs.v.Notifications'

class hs.v.Notifications extends hs.View

  init: ->
    this.handle = _.bind this.handle, this

    zz.on 'notification', this.handle


  handle: (message, key) ->
    n = $ "
      <div class='notification'>
        #{message}
      </div>
    "

    n.append "<a href='/#{key}'>Listing</a>" if key?

    this.template.el.append(n)

    n.fadeIn 200, (-> setTimeout (-> n.fadeOut 200, -> n.remove()), 5000)


  preRemove: -> zz.removeListener 'notification', this.handle


