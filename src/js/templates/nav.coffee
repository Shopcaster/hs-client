
dep.require 'hs.Template'
dep.require 'hs.t.NewListing'

dep.provide 'hs.t.Nav'

class hs.t.Nav extends hs.Template

  appendTo: '#header > .width'

  template: -> """
    <ul>
      <li class="right">
        <a href="javascript:;" class="button new-listing">New Item</a>
      </li>
    </ul>
    """

  subTemplates:
    newListing:
      class: hs.t.NewListing

  postRender:->
    this.newListingTmpl()
