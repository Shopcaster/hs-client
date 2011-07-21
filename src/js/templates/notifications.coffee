
dep.require 'hs.Template'

dep.provide 'hs.t.Notifications'


class hs.t.Notifications extends hs.Template

  postRender: ->
    this.handle = _.bind this.handle, this

    zz.on 'notification', this.handle


  handle: (message, key) ->
    n = $ "
      <div class='notification'>
        #{message}
      </div>
    "

    n.append "<a href='/#{key}'>Listing</a>" if key?

    $('#notifications').append(n)

    n.fadeIn 200, (-> setTimeout (-> n.fadeOut 200, -> n.remove()), 5000)


  preRemove: -> zz.removeListener 'notification', this.handle
