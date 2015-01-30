window.Chronos = Ember.Application.create({
    LOG_TRANSITIONS: true
});

Chronos.ApplicationAdapter = DS.FixtureAdapter.extend();

/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/store');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/components/*');
require('scripts/views/*');
require('scripts/router');
