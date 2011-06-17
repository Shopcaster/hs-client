//depends: core/views/main.js,
//         core/views/forms/form.js,
//         listings/views/main.js,
//         listings/models.js,
//         offers/views/list.js,
//         inquiries/views/list.js,
//         auth/views.js


hs.listings.views.Thanks = hs.views.Page.extend({
  template: 'thanks',
  initialize: function(){
    // hs.auth.views.Page.prototype.initialize.apply(this, arguments);
    $('#newListing').parent().addClass('thanks');
    this.newBind = _.bind(this.again, this);
    $('#newListing').click(this.newBind);
    $('#newListing').text('Again');
  },
  again: function(){
    $('#newListing').parent().removeClass('thanks');
    $('#newListing').unbind('click', this.newBind);
    $('#newListing').text('Post');
    hs.goTo('!/listings/new/');
  }
});
