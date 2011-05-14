# hs-client Docs

Isn't documentation lovely? Please fill out details you discover that aren't clear currently, and do your best to keep these up-to-date when things change. It probably won't be perfect, but we'll try.

## relationship with Backbone.js

hs-client subclasses and extends pretty much everything in Backbone. There should be docs explaining each of these in more defail, but here is a quick map:

`Backbone.Model` = `hs.models.Model`
`Backbone.Collection` = `hs.models.ModelSet`
`Backbone.Controller` = `hs.Controller`
`Backbone.View` = `hs.views.View`

## Always super

When you're in a subclass of anything, and you overwrite something, always call the parent's version of the method, or extend the parent's object. Since it's not always clear how in JS, some examples:

    var MyView = hs.views.View.extend({
        events: _.extend({
            'click #myDiv': 'handler'
        }, hs.views.View.events),
        render: function(){
            hs.log('rendering');
            return this.__super__.render.apply(this, arguments);
            // the previous is equivilant to:
            return hs.views.View.prototype.render.apply(this, arguments);
        }
    });

## Creating new objects

If you need to create a new object, and you'd like to use Backbone's extend syntax, extend from `hs.Object`.

    var MyClass = hs.Object.extend({
        doesAnything: false
    });

Backbone doesn't expose this, so it's been exables this way.
