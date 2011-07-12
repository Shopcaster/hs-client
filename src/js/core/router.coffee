
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

        if (View = hs.v[Template.constructor.name])?
          current.v = new View template, kwargs

      break


$('a').live 'click', (e) -> load $(e.target).attr('href')
load = (url) ->
  if not Modernizr.history
    return document.location = url

  window.history.pushState null, null, url
  goTo url


window.onpopstate = ->
  #$ -> zz.init -> goTo document.location.pathname
  $ -> goTo document.location.pathname


zz.auth.on? 'change', ->
  newUser = zz.auth.curUser()
  current.t.authChange user, newUser
  tmpl.authChange user, newUser for tmpl in hs.globalTemplates
  user = newUser


$ -> hs.globalTemplates[i] = new Tmpl() for Tmpl, i in hs.globalTemplates
