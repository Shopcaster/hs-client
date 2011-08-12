
dep.require 'hs.Template'

dep.provide 'hs.t.About'


class hs.t.About extends hs.Template

  appendTo: '#main'

  template: -> """
    <div class="flatpage">
      <h1>About Hipsell</h1>

      <p>Hipsell is a new local marketplace for mobile phones and the web that offers
      a completely rethought and streamlined buying and selling experience.</p>

      <p>Using Hipsell you can sell items from your phone in record time with
      one simple step.  From there we take you to your item's page, which you
      can use to easily and quickly handle offers, create a public FAQ, and
      message with buyers.  No more inbox overload, no more clunky management
      tools, and no more hassle.  We even crosspost your item to other popular
      services to give it maximum exposure and get it sold <i>fast</i>.</p>

      <p>As a buyer on Hipsell, you're able to quickly browse nearby items.  When
      you see one you like we provide you with extra information about it, such as
      whether it's still available, what the highest offer is, who the seller is, and
      more.  Buyers on Hipsell use the same real-time messaging system as sellers,
      which makes it a breeze to ask questions or find a place to make an exchange.</p>

      <p>It's buy and sell, reinvented.</p>

      <h1>The Team</h1>

      <p>Hipsell is built by
      <a href="http://twitter.com/mattskilly">@mattskilly</a>
      <a href="http://twitter.com/defrex">@defrex</a> and
      <a href="http://twitter.com/lylepstein">@lylepstein</a>.</p>

      <h1>Contact Us</h1>

      <p>For feedack, questions, or anything else related to the site or app, you
      should visit our <a href="http://getsatisfaction.com/hipsell">GetSatisfaction</a>
      page by clicking the Feedback link above.</p>

      <p>If you need to get in touch with us for other reasons, you can email us
      at <a href="mailto: sold@hipsell.com">sold@hipsell.com</a>.</p>
    </div>
    """
