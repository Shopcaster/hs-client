
dep.require 'zz'
dep.require 'hs.urls'
dep.require 'hs.globalTemplates'

dep.provide 'hs.route'

return if window.route == false

current = t: null, v: null
user = null
viewMap = {}


display = (Template, url, parsedUrl)->
  document.title = 'Hipsell'

  current.t?.remove()
  current.v?.remove()

  current = t: null, v:null

  kwargs =
    pathname: url
    parsedUrl: parsedUrl

  Template.get kwargs, (template) ->
    return display hs.t.e404, [] if not template?

    current.t = template

    View = hs.v[Template.getName()] || hs.View

    current.v = new View template, kwargs

    if document.referrer.length > 0
      referrer = new URL document.referrer
    else
      referrer = host: 'direct'

    mpq.push ['track', 'route',
      browser: BrowserDetect.browser
      browser_version: BrowserDetect.version
      os: BrowserDetect.OS
      referrer_host: referrer.host
      referrer_path: referrer.path
      referrer_protocol: referrer.protocol
      referrer_args: referrer.query
      referrer_raw: referrer.raw
      model: template.model?._id
      url: url
      mp_note: 'User was routed to '+url
    ]

goTo = (url) ->

  for exp, Template of hs.urls
    parsed = new RegExp(exp).exec(url)
    if parsed?
      if Template.prototype.authRequired and not zz.auth.curUser()?
        return display hs.t.e403, []

      display Template, url, parsed.slice(1)
      return

  display hs.t.e404, []


# Global link handler
$('a').live 'click', (e) ->

  # Only handle plain left clicks, so that right clicking, shift
  # clicking, etc function as per usual.
  if (e.which != 1 || e.metaKey || e.shiftKey)
    return;

  location = $(this).attr('href')

  # Allow absolute urls to go through
  return if /^https?:\/\//.test location
  # Javascript dead links should be dead
  return if /^javascript:;$/.test location
  # As should standard hash only links
  return if location == '#'

  e.preventDefault();
  load location

load = hs.goTo = (url) ->
  if not window.history.pushState?
    return document.location = url

  window.history.pushState {}, '', url
  goTo url

  # Scroll to the top of the page
  $('window, body').scrollTop 0


# Handle url changes
popped = `('state' in window.history)`
initialURL = location.href
window.onpopstate = ->
  initialPop = !popped and location.href == initialURL
  popped = true
  return if initialPop

  goTo document.location.pathname

# If ZZ isn't present then we had a problem loading the library
# and need to bail out with an error message immediately.
#
# Note that we check for auth's existence because zz is guaranteed
# to be present due to the model code.
if not zz.auth
  # This has to be done manually, as the rest of the template system
  # relies on ZZ
  $('#main').html '''
    <div class="flatpage">
      <h1>Unable to Reach Hipsell Servers</h1>
      <p>Either you're offline or something is wrong with the our servers.</p>
      <p><strong>Refresh this page to try again.</strong></p>
    </div>
  '''

# Bootstrap the location
$ -> zz.init -> goTo document.location.pathname

# Handle auth changes
zz.auth.on 'change', ->
  newUser = zz.auth.curUser()
  current.t?.authChange user, newUser

  for tmpl in hs.globalTemplates
    tmpl.authChange user, newUser

  user = newUser


# Presence handling
$ -> zz.init ->
  activity = false
  ignoreActivity = false

  # If the mouse moves with the user offline, just set them back
  # to online
  awayActivity = ->
    zz.presence.online();

  # Every time there's activity while the user is online, we reset
  # the away timeout.
  oaTimeout = null
  onlineActivity = ->
    clearTimeout(oaTimeout) if oaTimeout
    oaTimeout = setTimeout ->
      zz.presence.away()
    , 30 * 1000 # 30s - CHANGE AWAY TIMING HERE
  # Bootstrap
  onlineActivity()

  # Set activity when the mouse moves
  $(document.body).bind 'mousemove', ->
    activity = true;
  # Also when a key is pressed
  $(document.body).bind 'keydown', ->
    activity = true;

  # To avoid clobbering performance, we perform all activity-related
  # logic here, every 1000 ms.
  setInterval ->
    if activity and not ignoreActivity
      if zz.presence.status == 'away'
        awayActivity()
      else if zz.presence.status == 'online'
        onlineActivity()
    activity = false;
  , 1000

  # Watch on the visibility API's.
  # Webkit
  document.addEventListener 'webkitvisibilitychange', ->
    if document.webkitHidden
      ignoreActivity = true
      zz.presence.away()
    else
      ignoreActivity = false
      zz.presence.online()
  # IE (WTF, IE supports something before Firefox?)
  document.addEventListener 'msvisibilitychange', ->
    if document.msHidden
      ignoreActivity = true
      zz.presence.away()
    else
      ignoreActivity = false
      zz.presence.online()

# Initialize global views
$ -> zz.init ->
  hs.globalViews = []
  user = zz.auth.curUser()

  for Tmpl, i in hs.globalTemplates
    hs.globalTemplates[i] = new Tmpl()
    hs.globalTemplates[i].authChange null, user

    View = hs.v[Tmpl.getName()] or hs.View
    hs.globalViews[i] = new View(hs.globalTemplates[i])
