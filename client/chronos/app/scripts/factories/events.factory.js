/**
 * @author Paul Moon
 * @ngdoc service
 * @name chronosApp.EventFactory
 * @description
 * Factory for using events, stored in one place.
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .service('EventFactory', EventFactory);

  EventFactory.$inject = ['RestService', '$log'];

  /* @ngInject */
  function EventFactory(RestService, $log) {
    var service = {
      events: [],
      getFilteredEvents: getFilteredEvents
    };

    return service;

    //////////////////////

    /**
     *
     * @param filterParams JSON object of params for filtering events
     */
    function getFilteredEvents(filterParams) {
      RestService.getFilteredEvents(filterParams)
        .then(function (response) {
          events = response.data;
          return events;
        }, function (response) {
          console.log('Could not get filtered events');
          $log.warn('Failed to retrieve filtered events: ' + filterParams);
          $log.warn('Response: ' + response);
        });
    }
  }
})();
