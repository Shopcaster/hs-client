//depends: core/data/conn.js, core/data/pubsub.js, core/loading.js

Backbone.sync = function(method, model, success, error){
  hs.loading();
  var done = function(err){
    hs.loaded();
    if (err)
      error(err);
    else
      success();
  }
  if (_.indexOf(['update', 'delete', 'read'], method) != -1
      && _.isUndefined(model._id)){
    return done('Cannot '+method+' a model with no _id.');
  }

  if (method == 'update'){
    hs.con.send('update', {
      key: model.key+':'+model._id,
      data: model.toJSON()
    }, function(ok, err){
      done(err);
    });
  }else if (method == 'create'){
    hs.con.send('create', {
      type: model.key,
      data: model.toJSON()
    }, function(_id, err){
      if (_id)
        model.set({_id: _id}, {raw: true});

      done(err);
    });
  }else if (method == 'delete'){
    hs.con.send('delete', {key: model.key+':'+model._id}, function(ok, err){
      done(err);
    });
  }else if (method == 'read'){
    hs.pubsub.sub(
      model.key+':'+model._id,
      function(fields){ // pub
        model.set(fields, {raw: true});
      },
      function(fields, err){ // response
        if (fields){
          model.set(fields, {raw: true});
          model.trigger('loaded');
        }
        done(err);
      }
    );
  }else{
    done('invalid method');
  }
};
