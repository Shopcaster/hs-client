//depends: main.js, core/auth/main.js

hs.api = function(path, method, data, clbk, context){
  var options = {
    method: 'GET',
    auth: true
  }

  if (typeof path == 'object'){
    options = _.defaults(path, options);
  }else{
    if (typeof method == 'object'){
      options.context = clbk;
      options.clbk = data;
      options.data = method;
      options.method = 'POST';
    }else if (_.isFunction(method)){
      options.context = data;
      options.clbk = method;
      options.method = 'GET';
      options.data = undefined;
    }
    if (_.isFunction(data)){
      options.context = clbk;
      options.clbk = data;
      options.data = undefined;
    }
  }
  _.bind(options.clbk, options.context);

  var passThrough = function(clbk){clbk();};
  if (options.auth)
    passThrough = hs.auth.authenticated;

  passThrough(function(){
    $.ajax({
      url: options.path,
      contentType: 'application/json',
      dataType: 'json',
      data: options.method == 'GET'? undefined: JSON.stringify(options.data),
      context: options.context,
      beforeSend: function(jqXHR){
        jqXHR.setRequestHeader('Authorization', 'Token '+hs.auth.token);
      },
      complete: function(jqXHR){
        if (jqXHR.status == 0){
          options.clbk(jqXHR.statusText, jqXHR.status);
        }else{
          options.clbk(JSON.parse(jqXHR.responseText), jqXHR.status);
        }
      }
    });
  });
};

//hs._BackboneSync = Backbone.sync;
Backbone.sync = function(method, model, success, error){
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read': 'GET'
  };
  hs.api({
    path: model.url(),
    method: methodMap[method],
    data: model.toJSON(),
    auth: model.auth[methodMap[method]],
    clbk: function(data, status){
      if (status < 400) success(data);
      else error(data);
    }
  });
};


$(document).bind('ajaxError', function(e, jqXHR){
  if (jqXHR.status == 500){
    var erframe = document.createElement('iframe');
    $('body').append(erframe);
    $(erframe).css({
      'position': 'absolute',
      'top': '5%', 'left': '50%',
      'width': '90%', 'height': '90%',
      'marginLeft': '-45%'
    }).attr('id', 'errorframe');
    var doc = erframe.document;
    if (erframe.contentDocument)// for moz
      doc = erframe.contentDocument;
    doc.open();
    doc.writeln(jqXHR.responseText);
    doc.close();
    var close = $('<a href="#" id="errorclose">X</a>');
    $('body').append(close);
    close.css({
      'position': 'absolute',
      'top': '0', 'right': '0',
      'padding': '5px'
    }).click(function(e){
      $('#errorframe').remove();
      close.remove();
    });
  }
});

