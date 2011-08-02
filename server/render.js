var XMLHttpRequest, dep, depends, fs, jsdom;
depends = require('depends');
jsdom = require("jsdom").jsdom;
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
fs = require('fs');
dep = null;
exports.init = function(opt, clbk) {
  return fs.readFile(opt.build + '/index.html', 'utf8', function(err, index) {
    var doc, window, zz;
    if (err != null) {
      throw err;
    }
    zz = "" + opt.conf.zz.server.protocol + "://" + opt.conf.zz.server.host + ":" + opt.conf.zz.server.port + "/api-library.js";
    doc = jsdom(index);
    window = doc.createWindow();
    window.route = false;
    window.alert = function() {
      return console.log.apply(console, arguments);
    };
    window.console = console;
    window.XDomainRequest = XMLHttpRequest;
    window.XMLHttpRequest = XMLHttpRequest;
    window.localStorage = {};
    window.Date = Date;
    window.Array = Array;
    window.Number = Number;
    window.conf = opt.conf;
    window.window = window;
    return depends.manageNode({
      src: opt.build + '/js',
      context: window,
      init: 'hs.urls'
    }, function(err, nodeDep) {
      if (err != null) {
        return clbk(err);
      }
      dep = nodeDep;
      return dep.dlIntoContext(zz, function(err) {
        if (err != null) {
          return clbk(err);
        }
        return dep.execute('hs.urls', clbk);
      });
    });
  });
};
exports.route = function(pathname, clbk) {
  var Template, exp, kwargs, parsed, _ref;
  console.log('routing to', pathname);
  _ref = dep.context.hs.urls;
  for (exp in _ref) {
    Template = _ref[exp];
    parsed = new RegExp(exp).exec(pathname);
    if (parsed != null) {
      kwargs = {
        pathname: pathname,
        parsedUrl: parsed.slice(1)
      };
      if (Template.prototype.authRequired) {
        break;
      }
      Template.get(kwargs, function(t) {
        var html;
        html = '<!DOCTYPE html>';
        html += dep.context.document.documentElement.innerHTML;
        clbk(null, html);
        return t.remove();
      });
      return;
    }
  }
  return clbk(404);
};