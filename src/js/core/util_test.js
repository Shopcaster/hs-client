//depends: core/util.js

module("Util");

test("isFloat", function(){
  ok(_.isFloat(32.23), 'simple float');
  ok(!_.isFloat(32), 'not simple int');
});

test("isInteger", function(){
  ok(_.isInteger(32), 'simple int');
  ok(!_.isInteger(32.23), 'not simple float');
});
