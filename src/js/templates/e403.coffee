
dep.require 'hs.Template'

dep.provide 'hs.t.e403'


class hs.t.e403 extends hs.Template

  appendTo: '#main'

  template: -> '''
    <div class="flatpage" style="text-align:center;">
      <p>
        You must be logged in to see this page. Click "login" in the top
        right corner to fix the problem.
      </p>
    </div>
  '''

  authChange: (prev, cur)-> hs.goTo document.location.pathname if cur?
