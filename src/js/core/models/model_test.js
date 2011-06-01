//depends: core/models/model.js

module('Model');

test('get and set', function(){

  var M = hs.models.Model.extend({
    key: 'test',
    fields: _.extend({
      fname: new hs.models.fields.StringField()
    }, hs.models.Model.prototype.fields)
  });

  var m = new M();

  m.set({fname: 'fval'});

  equal(m.get('fname'), 'fval', 'get returns the correct value');

});

test('basic fields', function(){
  var M = hs.models.Model.extend({
    key: 'test',
    fields: _.extend({
      str: new hs.models.fields.StringField(),
      int: new hs.models.fields.IntegerField(),
      flt: new hs.models.fields.FloatField(),
      bol: new hs.models.fields.BooleanField()
    }, hs.models.Model.prototype.fields)
  });

  var m = new M();

  // validation
  raises(function(){ m.set({str: 3}) }, 'int to str raises');
  raises(function(){ m.set({str: true}) }, 'bool to str raises');

  raises(function(){ m.set({int: '30'}) }, 'str to int raises');
  raises(function(){ m.set({int: true}) }, 'bool to int raises');
  raises(function(){ m.set({int: 20.22}) }, 'float to int raises');

  raises(function(){ m.set({col: 20.22}) }, 'float to bool raises');
  raises(function(){ m.set({col: 'true'}) }, 'str to bool raises');

  m.set({
    str: 'string',
    int: 20,
    flt: 22.22,
    bol: false
  });

});

test('complex fields', function(){
  var M = hs.models.Model.extend({
    key: 'test',
    fields: _.extend({
      date: new hs.models.fields.DateField(),
      money: new hs.models.fields.MoneyField()
    }, hs.models.Model.prototype.fields)
  });

  var m = new M();

  // date
  raises(function(){ m.set({date: 1306967669769}) }, 'timestamp to date raises');
  raises(function(){ m.set({date: '1306967669769'}) }, 'str to date raises');

  var dateVal = new Date(1306967669769);

  m.set({
    date: dateVal,
  });

  equals(m.attributes.date, 1306967669769, 'date stores as timestamp');

  ok(_.isDate(m.get('date')), 'date casts on get');

  equals(m.get('date').getTime(), dateVal.getTime(), 'date casts on get');

  // money
  raises(function(){ m.set({money: 'string'}) }, 'str to money raises');

  var money = 4.50;

  m.set({
    money: money,
  });

  equals(m.attributes.money, 450, 'money stores as cents');

  equals(m.get('money'), money, 'converts to float on get');

});
