var depends, fs, jsdom;
depends = require('depends');
jsdom = require('jsdom');
fs = require('fs');
exports.run = function(opt, res) {
  return fs.readFile(opt.build + '/index.html', 'utf8', function(err, index) {
    var zz;
    if (err != null) {
      throw err;
    }
    zz = "" + opt.conf.zz.server.protocol + "://" + opt.conf.zz.server.host + ":" + opt.conf.zz.server.port + "/api-library.js";
    console.log('zz', zz);
    return jsdom.env({
      html: index,
      scripts: [zz],
      done: function(err, window) {
        if (err) {
          throw err;
        }
        console.log('window.zz', window.zz);
        window.route = false;
        return depends.manageNode(opt.build + '/js', window, function(err, dep) {
          if (err != null) {
            throw err;
          }
          dep.context.renderFinished = function(dom) {
            res.writeHead(200, {
              'Content-Type': 'text/html'
            });
            res.write(dom);
            return res.end();
          };
          return dep.inContext(function() {
            var Template, exp, kwargs, parsed, _ref, _results;
            dep.require('hs.urls');
            _ref = hs.urls;
            _results = [];
            for (exp in _ref) {
              Template = _ref[exp];
              parsed = new RegExp(exp).exec(url);
              if (parsed != null) {
                kwargs = {
                  pathname: pathname,
                  parsedUrl: parsed.slice(1)
                };
                if (Template.prototype.authRequired) {
                  break;
                }
                Template.get(kwargs, function(template) {
                  if (!(template != null)) {
                    return;
                  }
                  return renderFinished(document.documentElement.innerHTML);
                });
                break;
              }
            }
            return _results;
          });
        });
      }
    });
  });
};