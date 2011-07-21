
dep.require 'hs.Template'

dep.provide 'hs.t.SocialResponse'


class hs.t.SocialResponse extends hs.Template

  appendTo: '#main'

  template: ->
    div class: 'flatpage', ->
      h1()
      p()


  postRender: ->
    network = this.options.parsedUrl[0]
    res = window.location.href.split('?')

    if res.length > 1
      res = res[1].split('=')

    else
      res = [true, false]

    this[network](res)


  twitter: (res) ->
    if res[0] == 'success'
      this.$('h1').text('Success!').addClass('success')
      this.$('p').html("You've successfully linked your Twitter account " +
                       "to your Hipsell account.<br><br>" +
                       '<a href="/settings/social">Click here</a> ' +
                       'to go back to the settings page.')
    else
      this.$('h1').text('Error').addClass('error')
      this.$('p').html("Something went wrong when we tried to connect " +
                       "your Twitter account to your Hipsell account. " +
                       "You might want to try connecting again.<br><br>" +
                       '<a href="/settings/social">Click here</a> ' +
                       'to go back to the settings page.')


  fb: (res) ->
    if res[0] == 'success'
      this.$('h1').text('Success!').addClass('success')
      this.$('p').html("You've successfully linked your Facebook account " +
                       "to your Hipsell account.<br><br>" +
                       '<a href="/settings/social">Click here</a> ' +
                       'to go back to the settings page.')
    else
      this.$('h1').text('Error').addClass('error')
      this.$('p').html("Something went wrong when we tried to connect " +
                       "your Facebook account to your Hipsell account. " +
                       "You might want to try connecting again.<br><br>" +
                       '<a href="/settings/social">Click here</a> ' +
                       'to go back to the settings page.')


  linkedin: (res) ->
    if res[0] == 'success'
      this.$('h1').text('Success!').addClass('success')
      this.$('p').html("You've successfully linked your LinkedIn account " +
                       "to your Hipsell account.<br><br>" +
                       '<a href="/settings/social">Click here</a> ' +
                       'to go back to the settings page.')

    else
      this.$('h1').text('Error').addClass('error')
      this.$('p').html("Something went wrong when we tried to connect " +
                       "your LinkedIn account to your Hipsell account. " +
                       "You might want to try connecting again.<br><br>" +
                       '<a href="/settings/social">Click here</a> ' +
                       'to go back to the settings page.')

