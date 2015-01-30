Chronos.Router.map(function () {
   this.resource('event', { path: '/event/:event_id' });
});

// Ember does this automatically: file:///Users/paulmoon/Downloads/emberjs.com/guides/routing/defining-your-routes/index.html
//Chronos.EventRoute = Ember.Route.extend({
//  model: function(params) {
//    return this.store.find('event', params.event_id);
//    return jQuery.getJSON("/events/" + params.event_id);
//  }
//});
