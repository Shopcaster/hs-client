
dep.require 'hs.View'

dep.provide 'hs.v.Notifications'

class hs.v.Notifications extends hs.View

  init: ->
    this.handle = _.bind this.handle, this

    zz.on 'notification', this.handle


  handle: (message, key, goto) ->
    n = $ "
      <div class='notification'>
        #{message}
      </div>
    "

    if goto?
      name = goto.split('/')[0]
      n.append "<a href='/#{goto}'>#{name}</a>"

    this.template.el.append(n)

    n.fadeIn 200, (-> setTimeout (-> n.fadeOut 200, -> n.remove()), 5000)


  preRemove: -> zz.removeListener 'notification', this.handle


