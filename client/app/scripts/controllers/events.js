Chronos.EventsController = Ember.ArrayController.extend({
    count: function() {
        return this.get('length');
    }.property()
});
