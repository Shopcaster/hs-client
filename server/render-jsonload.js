var XMLHttpRequest, cache, dep, depends, fs, jsdom, request, window;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
depends = require('depends');
jsdom = require("jsdom").jsdom;
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
fs = require('fs');
request = require('request');
require('colors');
dep = null;
cache = null;
window = null;
exports.ready = false;
exports.init = function(c, opt, clbk) {
  var content, file, files;
  cache = c;
  files = new depends.Files();
  files.js = {};
  for (file in cache) {
    content = cache[file];
    if (/\.js$/.test(file)) {
      files.js[file] = content;
    }
  }
  return files.parse(__bind(function() {
    var s, scripts, _i, _len, _ref;
    if (typeof err !== "undefined" && err !== null) {
      return typeof clbk === "function" ? clbk(err) : void 0;
    }
    files.clean();
    scripts = ['http://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js'];
    _ref = files.dependsOn('hs.urls');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      s = _ref[_i];
      scripts.push("" + opt.clientUri + files.map[s]);
    }
    return jsdom.env({
      html: cache.cleanIndex,
      scripts: scripts,
      done: __bind(function(errors, w) {
        var e, _j, _len2;
        if ((errors != null) && errors.length) {
          for (_j = 0, _len2 = errors.length; _j < _len2; _j++) {
            e = errors[_j];
            console.error('jsdom error:\n'.red, e);
          }
        }
        window = w;
        console.log(window.document.innerHTML);
        console.log('window.hs', window.hs);
        console.log('window.$', window.$);
        console.log('window.Prototype', window.Prototype);
        exports.ready = true;
        return typeof clbk === "function" ? clbk() : void 0;
      }, this)
    });
  }, this));
};
exports.route = function(pathname, clbk) {
  var Template, e404, exp, html, parsed, use, _ref;
  console.log('window.hs', window.hs);
  html = '<!DOCTYPE html>';
  e404 = function() {
    return use(window.hs.t.e404, [], 404);
  };
  use = function(Template, parsedUrl, status) {
    if (status == null) {
      status = 200;
    }
    return Template.get({
      pathname: pathname,
      parsedUrl: parsedUrl
    }, function(t) {
      if (!(t != null)) {
        return e404();
      }
      html += window.document.innerHTML;
      clbk(status, html);
      t.remove();
      return dep.context.$('#main').html('');
    });
  };
  try {
    _ref = window.hs.urls;
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
    html += window.document.innerHTML;
    return clbk(500, html);
  }
};