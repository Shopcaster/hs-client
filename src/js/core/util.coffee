
dep.require 'lib'
dep.provide 'util'


String.prototype.truncateWords = (number) ->
  return this.substr(0) if this.length <= 67

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

  if (this > now)
    return {text: 'the future', num: ''}

  if (this.getFullYear() < now.getFullYear())
    num = now.getFullYear() - this.getFullYear()
    s = if num > 1 then 's' else ''
    return {text: "year#{ s } ago", num: num}

  if (this.getMonth() < now.getMonth())
    num = now.getMonth() - this.getMonth()
    s = if num > 1 then 's' else ''
    return {text: "month#{ s } ago", num: num}

  if (this.getDate() < now.getDate())
    num = now.getDate() - this.getDate()
    s = if num != 1 then 's' else ''
    return {text: "day#{ s } ago", num: num}

  if (this.getHours() < now.getHours())
    num = now.getHours() - this.getHours()
    s = if num != 1 then 's' else ''
    return {text: "hour#{ s } ago", num: num}

  if (this.getMinutes() < now.getMinutes())
    num = now.getMinutes() - this.getMinutes()
    s = if num != 1 then 's' else ''
    return {text: "minute#{ s } ago", num: num}

  if (this.getSeconds() < now.getSeconds())
    num = now.getSeconds() - this.getSeconds()
    s = if num != 1 then 's' else ''
    return {text: "second#{ s } ago", num: num}

  return {text: 'just now', num: 0}





class window.URL

  reg: /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/

  constructor: (@raw) ->
    throw 'raw url required' if not raw?

    parsed = this.reg.exec this

    if parsed?
      this.protocol = parsed[2]
      this.host = parsed[3]
      this.path = parsed[4]
      this.file = parsed[6]
      this.query = parsed[7]
      this.hash = parsed[8]


  toString: -> this.raw
  valueOf: -> this.raw
