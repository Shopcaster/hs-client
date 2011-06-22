//depends: main.js

hs.loadScript = function(location){
  var script = document.createElement("script");
  script.src = location;
  document.body.appendChild(script);
}

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

  diffLocation: function(p1, p2){
    //see: http://www.movable-type.co.uk/scripts/latlong.html

    // distance:
    var R = 6371; // km
    var d = Math.acos(Math.sin(p1.latitude)*Math.sin(p2.latitude) +
                      Math.cos(p1.latitude)*Math.cos(p2.latitude) *
                      Math.cos(p2.longitude-p1.longitude)) * R;

    // bearing
    var dLon = _.toRad(p2.longitude-p1.longitude);
    var y = Math.sin(dLon) * Math.cos(p2.latitude);
    var x = Math.cos(p1.latitude)*Math.sin(p2.latitude) -
            Math.sin(p1.latitude)*Math.cos(p2.latitude)*Math.cos(dLon);
    var brng = _.toDeg(Math.atan2(y, x));

    if (brng < 0)
      brng = 90+Math.abs(brng);

    var dirs = [
      'North',
      'North West',
      'West',
      'South West',
      'South',
      'South East',
      'East',
      'North East',
      'North'
    ];

    var word = dirs[Math.round(brng/(360/dirs.length))];

    return {
      bearing: word,
      distance: d
    };
  }

});
