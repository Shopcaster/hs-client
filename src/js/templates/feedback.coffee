
dep.require 'hs.Template'

dep.provide 'hs.t.Feedback'

class hs.t.Feedback extends hs.Template

  appendTo: '#main'

  template:-> '''<div></div>'''

###
  postRender:->
    this.el.append '
      <script src="http://s3.amazonaws.com/getsatisfaction.com/javascripts/feedback-v2.js"></'+'script>'

    do check = ->
      if GSFM?
        feedback_widget_options = {}

        feedback_widget_options.display = "inline"
        feedback_widget_options.company = "hipsell"
        feedback_widget_options.placement = "left"
        feedback_widget_options.color = "#222"
        feedback_widget_options.style = "idea"
        feedback_widget = new GSFN.feedback_widget(feedback_widget_options)
      else
        console.log 'check failed'
        setTimeout check, 100
###
