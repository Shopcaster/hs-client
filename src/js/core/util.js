//depends: main.js

dep.require('hs');
dep.provide('util');

hs.loadScript = function(location){
  var script = document.createElement("script");
  script.src = location;
  document.body.appendChild(script);
}

_.mixin({
  BindAllTo: function(obj, context, methods){
    if (!_.isObject(obj)) throw(new Error('obj must be an object'));
    _.each(obj, function(val, key){
      if (_.isFunction(val) && (_.isUndefined(methods) || _.indexOf(methods, key) >= 0))
        _.bind(obj[key], context);
    });
    return obj;
  },
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
  }
})
