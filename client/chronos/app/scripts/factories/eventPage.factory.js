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

  EventPageFactory.$inject = ['RestService', '$q', '$log'];

  function EventPageFactory(RestService, $q, $log) {
    var factory =  {
      eventInstance: null,
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
      return factory.eventInstance;
    }

    /**
     * @description updates events that the factory holds.
     * @methodOf chronosApp:EventPageFactory
     * @returns {*}
     */
    function updateEvent(eventId) {
      return _updateEvent(eventId);
    }

    /**
     * @description Internal method for updating EventPageFactory.event.
     * @methodOf chronosApp:EventPageFactory
     * @returns {*}
     * @private
     */
    function _updateEvent(eventId) {
      return RestService.getEvent(eventId)
        .then(function(response) {
          var newEvent = response.data;
          factory.eventInstance = newEvent;
          return response.data;
        }, function (response) {
          $log.warn('Response: ' + response);
          return $q.reject(response);
        });
    }
  }
})();
