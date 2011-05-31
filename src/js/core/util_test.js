//depends: core/util.js

module("Util");

test("isFloat", function(){
  ok(_.isFloat(32.23), 'simple float');
  ok(_.isFloat(323423452345234523444452345.23234523452345234523452534243552354),
      'long float');

  ok(!_.isFloat(32), 'not simple int');
  ok(!_.isFloat(322345234523452344445234523234523452345234), 'not long int');
});

test("isInteger", function(){
  ok(_.isInteger(32), 'simple int');
  ok(_.isInteger(322345234523452344445234523234523452345234), 'long int');

  ok(!_.isInteger(32.23), 'not simple float');
  ok(!_.isInteger(323423452345234523444452345.23234523452345234523452524352354),
      'not long float');
});
