
dep.require 'hs'
dep.provide 'hs.urls'

dep.require 'hs.t.Home'
dep.require 'hs.t.Listing'
dep.require 'hs.t.Profile'
dep.require 'hs.t.About'
dep.require 'hs.t.HowItWorks'
dep.require 'hs.t.NameSetting'
dep.require 'hs.t.SocialSetting'
dep.require 'hs.t.SocialResponse'

hs.urls =
  '^/?$': hs.t.Home

  '^/(listing/\\d+)': hs.t.Listing
  '^/(user/[\\da-f]+)': hs.t.Profile

  #settings
  '^/settings/name': hs.t.NameSetting
  '^/settings/password': hs.t.PasswordSetting
  '^/settings/social': hs.t.SocialSetting
  '^/social/connect/(\\w+)': hs.t.SocialResponse

  #flat
  '^/about': hs.t.About
  '^/how-it-works': hs.t.HowItWorks
