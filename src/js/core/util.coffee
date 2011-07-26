
dep.require 'lib'
dep.provide 'util'


String.prototype.truncateWords = (number) ->
  words = this.substr(0, number).split(' ')

  if words.length > 1
    words.pop()
    words = words.join(' ')+'...'

  else
    words = words[0]

  return words


Number.prototype.isFloat = (n) -> n == +n and not _.isInteger(n)
Number.prototype.isInteger = (n) -> n==+n && n==Math.floor(n)
Number.prototype.toRad = () -> this * Math.PI / 180
Number.prototype.toDeg = () -> this * 180 / Math.PI


Number.prototype.degreesToDirection = () ->
  dirs = [
    'north',
    'north west',
    'west',
    'south west',
    'south',
    'south east',
    'east',
    'north east',
    'north'
  ]
  return dirs[Math.round(this/(360/dirs.length))]



Date.prototype.since = (since) ->
  now = since || new Date();

  if (this <= now)
    if (this.getFullYear() < now.getFullYear())
      return {'text': 'Years ago', 'num': now.getFullYear() - this.getFullYear()}

    else
      if (this.getMonth() < now.getMonth())
        return {'text': 'Months ago', 'num': now.getMonth() - this.getMonth()}
      else
        if (this.getDate() < now.getDate())
          return {'text': 'Days ago', 'num': now.getDate() - this.getDate()}

        else
          if (this.getHours() < now.getHours())
            return {'text': 'Hours ago', 'num': now.getHours() - this.getHours()}

          else
            if (this.getMinutes() < now.getMinutes())
              return {'text': 'Minutes ago', 'num': now.getMinutes() - this.getMinutes()}

            else
              if (this.getSeconds() < now.getSeconds())
                return {'text': 'Seconds ago', 'num': now.getSeconds() - this.getSeconds()}

              else
                return {'text': 'just now', 'num': 0};

  else
    #throw new Error('_.since only accepts dates from the past', date)
    return {'text': 'the future', 'num': 0}


