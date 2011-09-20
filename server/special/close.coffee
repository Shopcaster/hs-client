

exports.take = (req, res)->
  res.writeHead 200,
    'Content-Type': 'text/html; charset=utf-8'
    'Cache-Control': 'no-cache'
  res.write '<html><head><script>window.close();</script></head></html>'
  res.end()
