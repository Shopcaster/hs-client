
dep.require 'hs.Template'

dep.provide 'hs.t.Error'

class hs.t.Error extends hs.Template

  prependTo: 'body'

  template:-> """
    <div class='topError'>
      <div class="message">#{this.options.message}</div>
    </div>
  """
