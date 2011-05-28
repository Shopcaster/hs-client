//depends: main.js

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
  }
})
