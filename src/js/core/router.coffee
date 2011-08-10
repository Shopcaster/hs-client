
dep.require 'zz'
dep.require 'hs.urls'
dep.require 'hs.globalTemplates'

dep.provide 'hs.route'

return if window.route == false

current = t: null, v: null
user = null


display = (Template, url, parsedUrl)->
  $('title').text 'Hipsell'

  current.t?.remove()
  current.v?.remove()

  current = t: null, v:null

  kwargs =
    pathname: url
    parsedUrl: parsedUrl

  Template.get kwargs, (template) ->
    return if not template?

    current.t = template

    View = hs.v[Template.name] ||  hs.View

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
      break if Template.prototype.authRequired and not zz.auth.curUser()?
      display Template, url, parsed.slice(1)
      return

  display hs.t.e404, []



$('a').live 'click', (e) ->

  location = $(this).attr('href')

  return if /^https?:\/\//.test location
  return if /^javascript:;$/.test location

  e.preventDefault();
  load location

load = (url) ->
  if not window.history.pushState?
    return document.location = url

  window.history.pushState {}, '', url
  goTo url


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


