
dep.require 'hs'
dep.provide 'hs.urls'

dep.require 'hs.t.Listing'
dep.require 'hs.t.About'
dep.require 'hs.t.HowItWorks'

hs.urls =
  '^/(listing/\\d+)/?': hs.t.Listing
  '^/about/?': hs.t.About
  '^/how-it-works/?': hs.t.HowItWorks
