
dep.require 'hs.Template'
dep.require 'hs.settingsNav'

dep.provide 'hs.t.SocialSetting'


class hs.t.SocialSetting extends hs.Template

  authRequired: true
  appendTo: '#main'

  template: hs.settingsNav '''
    <h1>Social Integration</h1>
    <p>You can link Facebook, Twitter, and LinkedIn accounts to your Hipsell account.  Links to these will show up on your profile.</p>

    <h3>Accounts You've Linked</h3>
    <p id="linked"></p>

    <h3>Link an Account</h3>
    <p id="unlinked"></p>
    '''


  _buildl: (h, t, l) ->
    "<a target='_blank' href='#{h}'><img src='/img/#{t}.png' alt='#{l}'></a>"



  _buildu: (t, l) ->
    user = zz.auth.curUser()
    enc = encodeURIComponent
    loc = window.location
    loc = (loc.protocol + '//' + loc.host)
    s = conf.zz.server

    ret = s.protocol + '://' + s.host + ':' + s.port + s.path
    ret += t + '/connect'
    ret += '?email=' + enc(user.email) +
           '&password=' + enc(user.password) +
           '&return=' + enc(loc + '/social/connect/' + t)

    ret = '<a href="' + ret + '"><img src="/img/' + t +
          '.png" alt="' + l + '"></a>'

    return ret


  postRender: ->
    user = zz.auth.curUser()

    return if not user?

    if user.fb
      this.$('#linked').append($(this._buildl(fb, 'fb', 'Facebook')))

    else
      this.$('#unlinked').append($(this._buildu('fb', 'Facebook')));


    if user.twitter
      this.$('#linked').append($(this._buildl(twitter, 'twitter', 'Twitter')))

    else
      this.$('#unlinked').append($(this._buildu('twitter', 'Twitter')))


