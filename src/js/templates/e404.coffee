
dep.require 'hs.Template'

dep.provide 'hs.t.e404'


class hs.t.e404 extends hs.Template

  appendTo: '#main'


  template: -> '''
    <div class="flatpage">
      <h1>404 &ndash; Page Not Found</h1>
      <p>Something witty.</p>
    </div>
  '''
