var XMLHttpRequest, cache, dep, depends, fs, jsdom;
depends = require('depends');
jsdom = require("jsdom").jsdom;
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
fs = require('fs');
require('colors');
dep = null;
cache = null;
exports.ready = false;
exports.init = function(c, opt, clbk) {
  var content, file, files, window;
  cache = c;
  window = jsdom(cache.cleanIndex).createWindow();
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
  window.conf = opt;
  files = new depends.Files();
  files.js = {};
  for (file in cache) {
    content = cache[file];
    if (/\.js$/.test(file) && file !== '/main.js') {
      files.js[file] = content;
    }
  }
  dep = new depends.NodeDep(files, {
    context: window,
    init: 'hs.urls'
  });
  return dep.dlIntoContext("" + opt.serverUri + "/api-library.js", function(err) {
    if (err != null) {
      return clbk(err);
    }
    return dep.execute('hs.urls', function() {
      exports.ready = true;
      return typeof clbk === "function" ? clbk() : void 0;
    });
  });
};
exports.route = function(pathname, clbk) {
  var Template, e404, exp, html, parsed, use, _ref;
  html = '<!DOCTYPE html>';
  e404 = function() {
    return use(dep.context.hs.t.e404, [], 404);
  };
  use = function(Template, parsedUrl, status) {
    if (status == null) {
      status = 200;
    }
    console.log('using', Template.name);
    return Template.get({
      pathname: pathname,
      parsedUrl: parsedUrl
    }, function(t) {
      console.log('done');
      if (!(t != null)) {
        return e404();
      }
      html += dep.context.document.innerHTML;
      clbk(status, html);
      t.remove();
      return dep.context.$('#main').html('');
    });
  };
  try {
    _ref = dep.context.hs.urls;
    for (exp in _ref) {
      Template = _ref[exp];
      parsed = new RegExp(exp).exec(pathname);
      if (parsed != null) {
        if (Template.prototype.authRequired) {
          break;
        }
        use(Template, parsed.slice(1));
        return;
      }
    }
    return e404();
  } catch (e) {
    console.log(('error' + e.stack).red);
    html += dep.context.document.innerHTML;
    return clbk(500, html);
  }
};