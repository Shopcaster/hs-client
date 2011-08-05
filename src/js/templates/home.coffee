
dep.require 'hs.Template'

dep.provide 'hs.t.Home'


class hs.t.Home extends hs.Template

  appendTo: '#main'


  template: -> '<div class="home"></div>'

###
  subTemplates:
    userListings:
      class: hs.t.UserListings


  postRender: ->
    this.model.relatedListings 'creator', (listings) =>
      this.userListingsTmpl listings, appendTo: '#'+this.id


hs.t.Profile.getModel = (options, clbk) ->
  zz.data.user options.parsedUrl[0], clbk
###




###Launchrock
    return if not LR?

    LR.lrInstance = new LrInstance 'launchrock',
      tagLine: ""
      description: "Opening soon"
      refCodeUrl: "http://hipsell.com/?ref="
      lrDomain: "hipsell.com"
      apiKey: "181013a631ae67a5b338ece83bb2943b"
      inviteList: "Enter your email to join our invite list."

    # Handles events related to signup form, form validations
    # and submitting the form to the server:
    LR.signupForm = new SignupForm secondaryPostLocation: ""


    # Handles rendering the post submit content:
    LR.postSubmit = new PostSignupForm 'pagesubmit'
      twitterHandle: "hipsellapp"
      twitterMessage: "Hipsell lets you sell stuff fast. It's launching soon and I'm one of the first in line! Join me. #launch"
      newUserHeaderText: "Thanks! Want to get an early invitation?"
      newUserParagraphText: "Invite at least 3 friends using the link below. The more friends you invite, the sooner you'll get access!<br/><br/>To share with your friends, click 'Recommend', 'Tweet' and 'Invite by Email':"
      newUserParagraphText3: "Or copy and paste the following link to share wherever you want!"
      returningUserHeaderText: "Welcome Back!"
      returningUserParagraphText: "Invite at least 3 friends using the link below. The more friends you invite, the sooner you'll get access!<br/><br/>To share with your friends, click 'Recommend', 'Tweet' and 'Invite by Email':"
      returningUserParagraphText3: "Or copy and paste the following link to share wherever you want!"
      statsPreText: "Your live stats: "
      footerLinks: "<a href='http://twitter.com/hipsellapp'>Follow Us on Twitter</a> | <a href='http://www.facebook.com/pages/Hipsell/195541250478651'>Like Us on Facebook</a>"
      showDescription: true
      showTagLine: false
      showHeaderText: true
      showParagraphText: true
      showStats: true
      showShareButtons: true
      showFooterLinks: true
###
