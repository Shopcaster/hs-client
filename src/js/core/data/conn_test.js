//depends: core/data/conn.js

module("Connection");

test("connect", function(){
  expect(1);

  stop(1000);

  hs.con.isConnected(function(){
    ok(true, 'connected');
    start();
  });

});

test("reconnect", function(){
  expect(1);

  stop(1000);

  hs.con.reconnect(function(){
    ok(true, 'reconnected');
    start();
  });

});

test("ping", function(){
  expect(1);

  stop(1000);

  hs.con.send('ping', {}, function(){
    ok(true, 'ping responded');
    start();
  });

});
