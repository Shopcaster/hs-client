
dep.require 'hs.views.View'
dep.require 'hs.messages.views'
dep.require 'hs.messages.views.LIConvo'

dep.provide 'hs.messages.views.ConvoList'

hs.messages.views.ConvoList = hs.views.View.extend
  template: 'convoList'

  modelEvents:
    'change:convos': 'convosChange'
    'add:convos': 'convosAdd'
    'remove:convos': 'convosRemove'
  

  render: ->
    hs.views.View.prototype.render.apply this, arguments
    this.renderConvos()

  renderConvos: ->
    this.convoViews ||= {}

    this.model.withField 'convos', =>
      this.model.get('convos').each (convo) =>

        if not this.convoViews[convo._id]?
          this.convoViews[convo._id] = new hs.messages.views.LIConvo
            appendTo: $('.convoList')
            model: convo
            listing: this.model

        if not this.convoViews[convo._id].rendered
          this.convoViews[convo._id].render()

        if  this.disabled
          this.convoViews[convo._id].lock()
          
          if this.acceptedMessage._id == convo._id
            this.convoViews[convo._id].accepted()


  convosChange: ->
    this.renderConvos()


  convosAdd: ->
    this.renderConvos()


  convosRemove: (convos) ->
    _.each convos, (convo) =>
      if (!_.isUndefined(this.convoViews[convo._id]))
        this.convoViews[convo._id].remove()
        delete this.convoViews[convo._id]
  

  disable: ->
    this.disabled = true;
    _.each this.convoViews, (view, id) ->
      view.lock()
  

  enable: ->
    this.disabled = false;
    _.each this.convoViews, (view) ->
      view.unlock()
