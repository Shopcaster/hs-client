//depends:main.js

hs.views = new Object();

hs.views.View = Backbone.View.extend({
    _tmplContext: _.defaults(this.options || {}, {}),
    render: function(){
        if (this.template) $(this.el).html(this.renderTmpl());
        return this;
    },
    renderTmpl: function(){
        if (typeof this.template == 'undefined')
            throw('must define dialog template');
        var context = _.clone(this._tmplContext);
        if (this.model)
            context = _.extend(context, this.model.toJSON());
        return ich[this.template](context);
    }
});



hs.views.Page = hs.views.View.extend({
    id: 'main',
});



hs.views.Dialog = hs.views.View.extend({
    el: $('#dialog')[0],
    buttons: {
        "OK": function(){this.trigger('click:ok').close();},
        "Cancel": function(){this.trigger('click:cancel').close();}
    },
    buttonBind: function(){
        _.each(this.buttons, _.bind(function(value, key){
            if (_.isFunction(value))
                this.buttons[key] = _.bind(value, this);
        }, this));
    },
    render: function(){
        $('body').append(this.el);
        this.buttonBind();
        $(this.el).html(this.renderTmpl()).dialog({
            modal: true,
            buttons: this.buttons
        });
        return this;
    },
    close: function(){return this.remove()},
    remove: function(){
        $(this.el).dialog('close').remove();
        return this;
    }
});

hs.views.FormDialog = hs.views.Dialog.extend({
    buttons: {
        "Submit": function(){this.$('form').submit();},
        "Cancel": function(){this.trigger('click:cancel').close();}
    },
    events: {
        'submit form': 'submit'
    },
    submit: function(e){
        e.preventDefault();
        this.trigger('submit').close();
    }
});
