//depends: main.js, core/auth/dialog.tmpl, core/views.js

hs.auth = hs.auth || new Object();

hs.auth.Dialog = hs.views.FormDialog.extend({
    template: 'authDialog',
    events: _.extend(hs.views.FormDialog.prototype.events, {
        'click a.password': 'showPassword',
        'click a.cancel-password': 'hidePassword'
    }),
    render: function(){
        hs.views.FormDialog.prototype.render.apply(this, arguments);
        if (this.options && this.options.expectLogin)
            this.showPassword();
    },
    submit: function(e){
        e.preventDefault();
        this.email = $('input[name=email]').val();
        this.trigger('set:email', this.email);
        this.password = $('input[name=password]').val();
        this.trigger('set:password', this.password);
        hs.views.FormDialog.prototype.submit.apply(this, arguments);
        if (this.options && this.options.submit)
            this.options.submit(this.email, this.password);
    },
    showPassword: function(e){
        if (e) e.preventDefault();
        this.$('a.password').hide(200);
        this.$('label.password').show(200);
    },
    hidePassword: function(e){
        if (e) e.preventDefault();
        this.$('label.password').hide();
        this.$('a.password').show(200);
    }
});
