
dep.require 'hs'

dep.provide 'hs.settingsNav'

hs.settingsNav = (input) ->
  """
  <div class="flatpage settings">
      <div id="nav">
          <a href="/settings/name">Change Public Name</a>
          <a href="/settings/password">Change Password</a>
          <a href="/settings/social">Social Integration</a>
      </div>

      <div id="setting">
        #{input}
      </div>
  </div>
  """
