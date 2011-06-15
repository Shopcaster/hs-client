//depends: core/data/conn.js, core/init.js, core/views/view.js

hs.nots = {
  init: function(){
    hs.con.bind('not', this.recieved);
  },
  recieved: function(data){
    var notView = new hs.nots.Notification(data);
    notView.render();
    setTimeout(function(){
      notView.remove();
      notView = null;
    }, 5000);
  }
}
_.bindAll(hs.nots);
// _.extend(hs.nots, Backbone.Events);

hs.init(hs.nots.init);

hs.nots.Notification = hs.views.View.extend({
  _configure: function(){
    hs.views.View.prototype._configure.apply(this, arguments);
    if (this.options.message) this.message = this.options.message;
    if (this.options.key) this.key = this.options.key;
  },
  render: function(){
    var htm = '<div class="notification">';
    htm += this.message;
    htm += '</div>';
    $('#notifications').append(htm);
  }
});
