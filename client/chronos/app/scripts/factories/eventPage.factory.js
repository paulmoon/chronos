/**
 * @author Danny Guan
 * @ngdoc function
 * @name chronosApp:EventPageFactory
 * @description provider for the event page
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .factory('EventPageFactory', EventPageFactory);

  EventPageFactory.$inject = ['RestService', '$route', '$q', '$log'];

  function EventPageFactory(RestService, $route, $q, $log) {
    var factory =  {
      event: {},
      getEvent: getEvent,
      updateEvent: updateEvent
    };

    return factory;

    //////////////////////

    /**
     * @description Returns the events that the factory holds.
     * @methodOf chronosApp:EventPageFactory
     * @returns Get event in the EventPageFactory.
     */
    function getEvent() {
      return factory.event;
    }

    /**
     * @description updates events that the factory holds.
     * @methodOf chronosApp:EventPageFactory
     * @returns {*}
     */
    function updateEvent() {
      return _updateEvent();
    }

    /**
     * @description Internal method for updating EventPageFactory.event.
     * @methodOf chronosApp:EventPageFactory
     * @returns {*}
     * @private
     */
    function _updateEvent() {
      return RestService.getEvent($route.current.params.eventId)
        .then(function(response) {
          var newEvent = response.data;
          factory.event = newEvent;
          return response.data;
        }, function (response) {
          $log.warn('Response: ' + response);
          return $q.reject(response);
        });
    }
  }
})();
