//depends: main.js

dep.require('hs');
dep.provide('util');

hs.loadScript = function(location){
  var script = document.createElement("script");
  script.src = location;
  document.body.appendChild(script);
};

(function() {
  var meta = {};

  hs.flushMeta = function() {
    for (var i in meta) if (meta.hasOwnProperty(i)) {
      document.getElementsByTagName('head')[0].removeChild(meta[i]);
      delete meta[i];
    }

  };
  hs.setMeta = function(prop, content) {
    var m = meta[prop];

    if (!m) {
      var m = document.createElement('meta');
      m.setAttribute('property', prop);

      document.getElementsByTagName('head')[0].appendChild(m);
      meta[prop] = m;
    }

    m.setAttribute('content', content);
  };
})();

_.mixin({

  isFloat: function(n){
    return n===+n && !_.isInteger(n);
  },

  isInteger: function(n){
    return n===+n && n===Math.floor(n);
  },

  since: function(date, since){
    if (!_.isDate(date))
      date = new Date(date);
    if (!_.isDate(date))
      throw(new Error ('invalid date passed to _.since'));

    var now = since || new Date();

    if (date < now){
        if (date.getFullYear() < now.getFullYear()){
            return {'text': 'Years ago', 'num': now.getFullYear() - date.getFullYear()};
        }else{
            if (date.getMonth() < now.getMonth()){
                return {'text': 'Months ago',
                        'num': now.getMonth() - date.getMonth()};
            }else{
                if (date.getDate() < now.getDate()){
                    return {'text': 'Days ago',
                            'num': now.getDate() - date.getDate()};
                }else{
                    if (date.getHours() < now.getHours()){
                        return {'text': 'Hours ago',
                                'num': now.getHours() - date.getHours()};
                    }else{
                        if (date.getMinutes() < now.getMinutes()){
                            return {'text': 'Minutes ago',
                                    'num': now.getMinutes() - date.getMinutes()};
                        }else{
                            if (date.getSeconds() < now.getSeconds()){
                                return {'text': 'Seconds ago',
                                        'num': now.getSeconds() - date.getSeconds()};
                            }else{
                                return {'text': 'just now', 'num': 0};
                            }
                        }
                    }
                }
            }
        }
    }else{
        hs.error('_.since only accepts dates from the past', date);
    };
  },

  toRad: function(n) {
    if (!_.isNumber(n)) throw(new Error('toRad only takes numbers'));
    return n * Math.PI / 180;
  },

  toDeg: function(n) {
    if (!_.isNumber(n)) throw(new Error('toDeg only takes numbers'));
    return n * 180 / Math.PI;
  },

  degreesToDirection: function(brng){
    var dirs = [
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

    var word = dirs[Math.round(brng/(360/dirs.length))];

    return word;
  }

});
