

#special urls all start with /special

urls =
  '/special/close': require './close'

exports.isHandling = (req, res, pathname)->

  for exp, mod of urls
    parsed = new RegExp(exp).exec(pathname)
    if parsed?
      mod.take req, res
      return true

  return false
