//depends: core/data/conn.js, core/data/pubsub.js, core/loading.js

Backbone.sync = function(method, model, success, error){
  hs.loading();
  var done = function(success){
    hs.loaded();
    if (success) success({model: model});
    else error({model: model});
  }
  if (_.indexOf(['update', 'delete', 'read'], method) != -1
      && _.isUndefined(model.id)){
    hs.error('Cannot '+method+' a model with no id.');
    return done(false);
  }

  if (method == 'update'){
    hs.con.send('update', {
      key: model.key+':'+model.id,
      data: model.toJSON()
    }, done);
  }else if (method == 'create'){
    hs.con.send('create', {
      key: model.key,
      data: model.toJSON()
    }, function(id){
      if (id){
        model.set({id: id});
        done(true);
      } else{
        done(false);
      }
    });
  }else if (method == 'delete'){
    hs.con.send('delete', {key: model.key+':'+model.id}, done);
  }else if (method == 'read'){
    var oneDone = _.once(done);
    hs.pubsub.sub(model.key+':'+model.id, function(fields){
      if (fields === false){
        oneDone(false);
      }else{
        model.set(fields);
        oneDone(true);
      }
    });
  }else{
    done(false);
  }
};
