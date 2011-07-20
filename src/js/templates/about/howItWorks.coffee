
dep.require 'hs.Template'

dep.provide 'hs.t.HowItWorks'


class hs.t.HowItWorks extends hs.Template

  appendTo: '#main'

  template: ->
    div class: 'flatpage', ->
      h1 'How It Works'

      h4 'How do I get more information about a listing?'
      p '''
          Use the "Ask a question" box, just below the image and on the left.
          When the seller answers your question, we'll let you know.
        '''

      h4 'How do I make an offer?'
      p '''
          Use the "Make an offer" box on the right, below the listing
          description. The seller will be notified that an offer has been
          posted, and you'll also be able to communicate about that offer by
          clicking on it and using Hipsell's built-in messaging system.
        '''

      h4 'Does Hipsell handle payment, shipping, etc?'
      p '''
          Nope, not yet. Buyers and sellers need to work that out between
          themselves for now.
        '''

      h4 'I found a bug/I need more help. What should I do?'
      p '''
          Head to our <a target="_blank" href="https://getsatisfaction.com/hipsell">
          GetSatisfaction</a> page and we'll help you out.
        '''

      h4 'How do I post something for sale?'
      p '''
          At the moment, we're only allowing a few select users to create listings. We'll be going into public beta soon enough, at which point you'll be able to post to your heart's content. If you're really keen on Hipsell, you can also sign up for our private beta at http://hipsell.com, which will put you on our beta invite list.
        '''
