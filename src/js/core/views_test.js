//depends: core/views.js

module("View");

test("view rendering", function(){

  var TestView = hs.views.View.extend({
    template: 'views_test',
    prepContext: function(ctx){
      ctx.testVar = 'tVal';
      return ctx
    }
  });

  var testView = new TestView({el: $('#main')});
  testView.render();

  var main = $('#main').text();
  var tmpl = ich.views_test({testVar: 'tVal'}).text();
  ok(main == tmpl, 'view renders template correctly');

  var testView2 = new TestView({appendTo: $('#main')});
  testView2.render();

  main = $('#main').text();
  tmpl += ich.views_test({testVar: 'tVal'}).text();
  ok(main == tmpl, 'view appends template correctly');

});
