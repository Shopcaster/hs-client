# hs Views

hs-client provides several views that extend `Backone.View` to add extra functionality. All of these extend `hs.views.View`.

## hs.views.View

All other hs views extend this class. It provides a few basic things such as template rendering and model event registration.

### Templating

Classes that extend `hs.views.View` can provide the field `tmpl`. This should be a string that referances an iCanHaz template. This template will be rendered when the `render` method is called on the class.

#### Example

Given the template (named `myTemplate.tmpl`):

    <h1>Hello View!</h1>

and the view class:

    MyView = hs.views.View.extend({
        tmpl: 'myTemplate'
    });

If you then:

    var myView = new MyView({el: $('body')});
    myView.render();

You would get:

    ...
    <body><h1>Hello View!</h1></body>
    ...

#### Modifying default behavour

By default only the view's model is inserted into the template context. To change this, modify `_tmplContext`.

    MyView = hs.views.View.extend({
        tmpl: 'myTemplate',
        setHello: function(value){
            this._tmplContext.hello = value;
        }
    });

    <h1>{{hello}}</h1>

    var myView = new MyView({el: $('body')});
    myView.setHello('Hello Context!');
    myView.render();

    <body><h1>Hello Context!</h1></body>

By default the template is rendered into `el` using jQuery's `html` method. You can change this using `_renderWith`.

    MyView = hs.views.View.extend({
        tmpl: 'myTemplate',
        _renderWith: 'append'
    });

    var myView = new MyView({el: $('body')});
    myView.render();

    <body>
        Normal body content that hasn't been overwritter.
        <h1>Hello View!</h1>
    </body>