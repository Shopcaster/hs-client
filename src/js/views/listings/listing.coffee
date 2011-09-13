
dep.require 'hs.View'

dep.provide 'hs.v.Listing'

class hs.v.Listing extends hs.View

  init: ->
    this.template.$('#listing-social .twitter').html '
      <a href="http://twitter.com/share"
         class="twitter-share-button"
         data-count="none"
         data-via="hipsellapp"
         data-text="Check out this awesome item for sale on Hipsell. Snap it up before it\'s too late.">
          Tweet
      </a>
      <script src="http://platform.twitter.com/widgets.js"></script>'


    this.template.$('#listing-social .fb').html "
      <iframe
        src='http://www.facebook.com/plugins/like.php?app_id=105236339569884&amp;href=#{encodeURIComponent(document.location.href)}&amp;send=false&amp;layout=standard&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font&amp;width=53&amp;height=24'
        scrolling='no'
        frameborder='0'
        style='border:none; overflow:hidden; width:53px; height:24px;'
        allowTransparency='true'>
      </iframe>"

    this.template.$('#listing-social .goog').html '
      <script type="text/javascript" src="https://apis.google.com/js/plusone.js"></script>
      <g:plusone size="medium" count="false"></g:plusone>'
