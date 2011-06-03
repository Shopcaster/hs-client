//depends: main.js

module('Backbone.Events');

test('multi trigger with once', function(){
  expect(2);

  var e = _.extend({}, Backbone.Events);
  var e2 = _.extend({}, Backbone.Events);

  var fired = 1;

  e.once('test', function(){
    ok(fired++ == 1, 'e event fired');
  });
  e2.once('test', function(){
    ok(fired++ == 2, 'e2 event fired');
  });

  e.trigger('test');
  e.trigger('test');
  e2.trigger('test');
  e = _.extend({}, Backbone.Events);
  e.trigger('test');
  e2.trigger('test');
});

test('context', function(){
  var revs = 2;

  expect(revs * 8);

  var Cons = [];
  for (var i = 0; i < revs; i++){
    var lid = 'l'+i, cid = 'c'+_.uniqueId();

    var Con = function(){
      this.lid = lid;
      this.cid = cid;
    }

    Con.prototype.doBind = function(){
      this.bind('ev', function(){
        equal(this.lid, lid, 'lid correct');
        equal(this.cid, cid, 'cid correct');
      }, this);
    }

    _.extend(Con.prototype, Backbone.Events);

    Cons.push(Con);
  }

  for (var i = 0; i < Cons.length; i++){
    var c = new Cons[i]();
    c.doBind();
    c.trigger('ev');

    var c2 = new Cons[i]();
    c.trigger('ev');
    c2.doBind();
    c.trigger('ev');
    c2.trigger('ev');
  }

});

test('arguments', function(){
  var revs = 2;

  expect(revs * 4);

  var Cons = [];
  for (var i = 0; i < revs; i++){
    var Con = function(){
      this.cid = cid = 'c'+_.uniqueId();
    }
    Con.prototype.doBind = function(){
      this.bind('ev', function(cid){
        equal(this.cid, cid, 'cid correct');
      }, this);
    }
    _.extend(Con.prototype, Backbone.Events);
    Cons.push(Con);
  }

  for (var i = 0; i < Cons.length; i++){
    var c = new Cons[i]();
    c.doBind();
    c.trigger('ev', c.cid);

    var c2 = new Cons[i]();
    c.trigger('ev', c.cid);
    c2.doBind();
    c.trigger('ev', c.cid);
    c2.trigger('ev', c2.cid);
  }

});

test('arguments with once', function(){
  var revs = 2;

  expect(revs * 2);

  var Cons = [];
  for (var i = 0; i < revs; i++){
    var Con = function(){
      this.cid = cid = 'c'+_.uniqueId();
    }
    Con.prototype.doBind = function(){
      this.once('ev', function(cid){
        equal(this.cid, cid, 'cid correct');
      }, this);
    }
    _.extend(Con.prototype, Backbone.Events);
    Cons.push(Con);
  }

  for (var i = 0; i < Cons.length; i++){
    var c = new Cons[i]();
    c.doBind();
    c.trigger('ev', c.cid);

    var c2 = new Cons[i]();
    c.trigger('ev', c.cid);
    c2.doBind();
    c.trigger('ev', c.cid);
    c2.trigger('ev', c2.cid);
  }

});
