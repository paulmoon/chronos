Chronos.Router.map(function () {
    this.resource('events', function(){
        this.route('create');
    });
});

Chronos.EventsRoute = Ember.Route.extend({
    model: function () {
        return this.get('store').find('event');
    }
});
