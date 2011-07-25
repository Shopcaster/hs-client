
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



_.mixin

  since: (date, since) ->
    if not _.isDate date
      date = new Date(date)
    if (!_.isDate(date))
      throw(new Error ('invalid date passed to _.since'))

    now = since || new Date();

    if (date <= now)
      if (date.getFullYear() < now.getFullYear())
        return {'text': 'Years ago', 'num': now.getFullYear() - date.getFullYear()}

      else
        if (date.getMonth() < now.getMonth())
          return {'text': 'Months ago', 'num': now.getMonth() - date.getMonth()}
        else
          if (date.getDate() < now.getDate())
            return {'text': 'Days ago', 'num': now.getDate() - date.getDate()}

          else
            if (date.getHours() < now.getHours())
              return {'text': 'Hours ago', 'num': now.getHours() - date.getHours()}

            else
              if (date.getMinutes() < now.getMinutes())
                return {'text': 'Minutes ago', 'num': now.getMinutes() - date.getMinutes()}

              else
                if (date.getSeconds() < now.getSeconds())
                  return {'text': 'Seconds ago', 'num': now.getSeconds() - date.getSeconds()}

                else
                  return {'text': 'just now', 'num': 0};

    else
      #throw new Error('_.since only accepts dates from the past', date)
      return {'text': 'the future', 'num': 0};


  toRad: (n) ->
    if not _.isNumber n then  throw new Error('toRad only takes numbers')
    return n * Math.PI / 180


  toDeg: (n) ->
    if not _.isNumber n then throw(new Error('toDeg only takes numbers'))
    return n * 180 / Math.PI


  degreesToDirection: (brng) ->
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
    ];

    word = dirs[Math.round(brng/(360/dirs.length))]

    return word


