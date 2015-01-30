Chronos.ApplicationRoute = Ember.Route.extend({
    beforeModel: function() {
        this.transitionTo('events');
    }
});
