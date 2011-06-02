//depends: core/data/conn.js, core/data/pubsub.js, core/loading.js

Backbone.sync = function(method, model, success, error){
  hs.loading();
  var done = function(worked){
    hs.loaded();
    if (worked) success();
    else error();
  }
  if (_.indexOf(['update', 'delete', 'read'], method) != -1
      && _.isUndefined(model._id)){
    hs.error('Cannot '+method+' a model with no _id.');
    return done(false);
  }

  if (method == 'update'){
    hs.con.send('update', {
      key: model.key+':'+model._id,
      data: model.toJSON()
    }, done);
  }else if (method == 'create'){
    hs.con.send('create', {
      type: model.key,
      data: model.toJSON()
    }, function(_id){
      if (_id){
        model.set({_id: _id}, {raw: true});
        done(true);
      } else{
        done(false);
      }
    });
  }else if (method == 'delete'){
    hs.con.send('delete', {key: model.key+':'+model._id}, done);
  }else if (method == 'read'){
    hs.pubsub.sub(
      model.key+':'+model._id,
      function(fields){ // pub
        model.set(fields, {raw: true});
      },
      function(fields){ // response
        if (fields === false || _.isString(fields)){
          done(false);
        }else{
          model.set(fields, {raw: true});
          model.trigger('loaded');
          done(true);
        }
      }
    );
  }else{
    done(false);
  }
};
