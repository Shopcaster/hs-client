
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

  console.log 'routed to ', url

  Template.get kwargs, (template) ->
    return display hs.t.e404, [] if not template?

    current.t = template

    console.log 'routed to template'
    #View = hs.v[Template.getName()] ||  hs.View
    console.log 'finding view', Template.getName()
    View = hs.v[Template.getName()]
    if not VIew?
      console.log 'view not found'
      View = hs.View

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


goTo = hs.goTo = (url) ->

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

load = (url) ->
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
  moved = false
  onMove = null

  # If the mouse moves with the user offline, just set them back
  # to online
  offlineMove = ->
    zz.presence.online();

  # If the mouse moves with the user offline, set them to offline
  # if they don't move the mouse for a while
  omTimeout = null
  onlineMove = ->
    clearTimeout(omTimeout) if omTimeout
    omTimeout = setTimeout ->
      zz.presence.offline()
    , 30 * 1000 # 30s - CHANGE AWAY TIMING HERE

  # Set moved to true when the mouse moves
  $(document.body).bind 'mousemove', ->
    moved = true;

  # Run movement logic no faster than once per second
  setInterval ->
    onMove() if moved
    moved = false;
  , 1000

  # To start, use the online handler
  onMove = onlineMove;

  # Change the handler when presence status changes
  zz.presence.on 'me', (status) ->
    if status == 'online'
      onMove = onlineMove
    else
      onMove = offlineMove

# Initialize global views
$ -> zz.init ->
  hs.globalViews = []
  user = zz.auth.curUser()

  for Tmpl, i in hs.globalTemplates
    hs.globalTemplates[i] = new Tmpl()
    hs.globalTemplates[i].authChange null, user

    View = hs.v[Tmpl.name] or hs.View
    hs.globalViews[i] = new View(hs.globalTemplates[i])


