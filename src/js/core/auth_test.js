
module("Auth");

test("Signup", function(){
  expect(3);

  stop(1000);
  hs.auth.signup('fake@email.info', function(err){
    if (err){
      start();
      throw(err);
    }

    equal(hs.auth.email, 'fake@email.info', 'email set correctly');
    ok(!_.isUndefined(hs.auth.pass), 'password set correctly');
    ok(!_.isUndefined(hs.auth.userId), 'user ID set correctly');

    start();
  });
});

test("Login", function(){
  expect(6);

  stop(1000);
  hs.auth.signup('fake2@email.info', function(err){
    if (err){
      start();
      throw(err);
    }

    var email = hs.auth.email;
    var password = hs.auth.pass;

    hs.auth.logout(function(){
      ok(_.isUndefined(hs.auth.email), 'logout removed email');
      ok(_.isUndefined(hs.auth.pass), 'logout removed password');
      ok(_.isUndefined(hs.auth.userId), 'logout removed user ID');

      hs.auth.setEmail(email);
      hs.auth.setPassword(password, false);

      hs.auth.login(function(err){
        if (err){
          start();
          throw(err);
        }

        equal(hs.auth.email, 'fake2@email.info', 'email set correctly');
        ok(!_.isUndefined(hs.auth.pass), 'password set correctly');
        ok(!_.isUndefined(hs.auth.userId), 'user ID set correctly');

        start();

      });
    });
  });
});

test("User", function(){
  expect(3);

  stop(1000);
  hs.auth.signup('fake3@email.info', function(err){
    if (err){
      start();
      throw(err);
    }
    var user = hs.users.User.get();

    ok(!_.isUndefined(user), 'user exists');

    user.once('loaded', function(){

      ok(!_.isUndefined(user._id), 'user has id');
      ok(!_.isUndefined(user.get('created')), 'user has created field');

      start();
    });
  });
});
