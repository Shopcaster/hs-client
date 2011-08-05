var XMLHttpRequest, cache, dep, depends, fs, jsdom;
depends = require('depends');
jsdom = require("jsdom").jsdom;
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
fs = require('fs');
require('colors');
dep = null;
cache = null;
exports.init = function(c, opt, clbk) {
  var content, doc, file, files, index, window, zz;
  cache = c;
  index = cache['/index.html'];
  doc = jsdom(index, null, {
    features: {
      FetchExternalResources: false
    }
  });
  window = doc.createWindow();
  window.route = false;
  window.console.log = function() {
    var args;
    args = Array.prototype.slice.call(arguments, 0);
    args.unshift('client:'.blue);
    return console.log.apply(console, args);
  };
  window.alert = window.console.log;
  window.XDomainRequest = XMLHttpRequest;
  window.XMLHttpRequest = XMLHttpRequest;
  window.localStorage = {};
  window.Date = Date;
  window.Array = Array;
  window.Number = Number;
  window.JSON = JSON;
  window.conf = opt.conf;
  window.window = window;
  files = new depends.Files();
  files.js = {};
  for (file in cache) {
    content = cache[file];
    if (/\.js$/.test(file)) {
      files.js[file] = content;
    }
  }
  dep = new depends.NodeDep(files, {
    context: window,
    init: 'hs.urls'
  });
  zz = "" + opt.conf.zz.server.protocol + "://" + opt.conf.zz.server.host + ":" + opt.conf.zz.server.port + "/api-library.js";
  return dep.dlIntoContext(zz, function(err) {
    if (err != null) {
      return clbk(err);
    }
    return dep.execute('hs.urls', clbk);
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
          if (!(t != null)) {
            return clbk(404, '');
          }
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