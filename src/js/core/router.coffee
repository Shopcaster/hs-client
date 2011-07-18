
dep.require 'zz'
dep.require 'hs.urls'
dep.require 'hs.globalTemplates'

dep.provide 'hs.route'

current = t: null, v: null
user = null


goTo = (url) ->

  for exp, Template of hs.urls
    parsed = new RegExp(exp).exec(url)
    if parsed?

      current.t?.remove()
      current.v?.remove()

      current = t: null, v:null

      kwargs =
        pathname: url
        parsedUrl: parsed.slice(1)

      Template.get kwargs, (template) ->
        current.t = template

        View = hs.v[Template.name] ||  hs.View

        current.v = new View template, kwargs

      break


$('a').live 'click', (e) ->
  # Only handle relative links
  if $(this).attr('href').substr(0, 4) != 'http'
    e.preventDefault();
    load $(e.target).attr('href')

load = (url) ->
  if not Modernizr.history
    return document.location = url

  window.history.pushState null, null, url
  goTo url



popped = `('state' in window.history)`
initialURL = location.href
window.onpopstate = ->
  initialPop = !popped and location.href == initialURL
  popped = true
  return if initialPop

  goTo document.location.pathname

$ -> zz.init -> goTo document.location.pathname


zz.auth.on 'change', ->
  newUser = zz.auth.curUser()
  current.t?.authChange user, newUser

  for tmpl in hs.globalTemplates
    tmpl.authChange user, newUser

  user = newUser


$ -> zz.init ->
  hs.globalViews = []
  user = zz.auth.curUser()

  for Tmpl, i in hs.globalTemplates
    hs.globalTemplates[i] = new Tmpl()
    hs.globalTemplates[i].authChange null, user

    View = hs.v[Tmpl.name] or hs.View
    hs.globalViews[i] = new View(hs.globalTemplates[i])
