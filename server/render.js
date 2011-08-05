var XMLHttpRequest, dep, depends, fs, id, jsdom;
depends = require('depends');
jsdom = require("jsdom").jsdom;
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
fs = require('fs');
require('colors');
dep = null;
id = 1;
exports.init = function(opt, clbk) {
  return fs.readFile(opt.build + '/index.html', 'utf8', function(err, index) {
    var doc, window, zz;
    if (err != null) {
      return clbk(err);
    }
    zz = "" + opt.conf.zz.server.protocol + "://" + opt.conf.zz.server.host + ":" + opt.conf.zz.server.port + "/api-library.js";
    doc = jsdom(index, null, {
      features: {
        FetchExternalResources: false
      }
    });
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
    window.JSON = JSON;
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
        return dep.execute('hs.urls', function() {
          return clbk();
        });
      });
    });
  });
};
exports.route = function(pathname, clbk) {
  var Template, exp, html, kwargs, parsed, _ref;
  html = '<!DOCTYPE html>';
  try {
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
          html += dep.context.document.innerHTML;
          clbk(null, html);
          return t.remove();
        });
        return;
      }
    }
    html += dep.context.document.innerHTML;
    return clbk(404, html);
  } catch (e) {
    console.log(('error' + e.stack).red);
    html += dep.context.document.innerHTML;
    return clbk(500, html);
  }
};