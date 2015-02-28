/**
 * @author Paul Moon
 * @ngdoc service
 * @name chronosApp.EventFactory
 * @description Factory used for retrieving (filtered) events from a single place.
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .service('EventFactory', EventFactory);

  EventFactory.$inject = ['RestService', '$log', '$q'];

  /* @ngInject */
  function EventFactory(RestService, $log, $q) {
    var service = {
      events: [],
      highlightedEvents: [],
      highlightedStart: undefined,
      highlightedEnd: undefined,
      tags: [],
      keywords: [],

      getEvents: getEvents,
      getHighlightedEvents: getHighlightedEvents,
      getFilteredEvents: getFilteredEvents,
      setHighlightRange: setHighlightRange
    };

    return service;

    //////////////////////

    /**
     * @description Returns the events that the factory holds.
     * @methodOf chronosApp:EventFactory
     * @returns List of events in the EventFactory.
     */
    function getEvents() {
      return service.events;
    }

    /**
     * @description Returns the events that the application is currently displaying.
     * @methodOf chronosApp:EventFactory
     * @returns List of events that the application is currently showing.
     */
    function getHighlightedEvents() {
      return service.highlightedEvents;
    }

    /**
     * @description Given an object of filter parameters, returns a list of matching events.
     * @methodOf chronosApp:EventFactory
     * @param filterParams JSON object of params for filtering events
     */
    function getFilteredEvents(filterParams) {
      return RestService.getFilteredEvents(filterParams)
        .then(function (response) {
          service.events = response.data;
          service.highlightedEvents = response.data;
          return response.data;
        }, function (response) {
          $log.warn('Failed to retrieve filtered events: ' + filterParams);
          $log.warn('Response: ' + response);
          return $q.reject(response);
        });
    }

    /**
     * Sets the start and end range for which to display the events. If June 15th selected, then the start time will be
     * June 15th 12:00:00 AM (UTC) and the end time will be June 16th 12:00:00 AM (UTC).
     * @param start Epoch time format
     * @param end Epoch time format
     */
    function setHighlightRange(start, end) {
      service.highlightedStart = start;
      service.highlightedEnd = end;

      // The only time we don't display any events is if eventStart > end or eventEnd < start.
      // Converse by De Morgan's Law: If eventStart <= end and eventEnd >= start
      service.highlightedEvents = service.events.filter(function (element) {

        // When the start and end dates are the same,
        if (moment(element.start_date).diff(moment(element.end_date)) == 0) {
          return moment(element.start_date) < end && moment(element.end_date) >= start;
        }

        // An event could be ending at 12AM June 15th and we don't want to show that event when we select
        // on June 15th. Similarly, if an event begins on June 15th 12AM and we click on June 14th, this means
        // end = June 15th 12AM. Since we don't want to show the event (because they are on different days),
        // strict inequality is used.
        return moment(element.start_date) < end && moment(element.end_date) > start;
      });
    }
  }
})();
