//depends: about/main.js, core/controller.js

hs.regController('about', hs.Controller.extend({
  routes: {
    '!/about/': 'about',
    '!/how-it-works/': 'how'
  },
  about: function(){
    hs.page.finish();
    hs.page = new hs.about.views.About();
    hs.page.render();
  },
  how: function(){
    hs.page.finish();
    hs.page = new hs.about.views.How();
    hs.page.render();
  }
}));
