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
      getEvents: getEvents,
      fullCalendarGetEvents: fullCalendarGetEvents,
      getFilteredEvents: getFilteredEvents
    };

    return service;

    //////////////////////

    /**
     * @description Returns the events that the application is displaying.
     * @methodOf chronosApp:EventFactory
     * @returns List of events that the application is currently showing.
     */
    function getEvents() {
      return service.events;
    }

    /**
     * @description Function signature provided by FullCalendar for retrieving a list of events for a given time range.
     * @methodOf chronosApp:EventFactory
     * @param start Start time of the range in which events are to be shown. Date type.
     * @param end End time of the range in which events are to be shown. Date type.
     * @param callback Function to be called after events are retrieved.
     */
    function fullCalendarGetEvents(start, end, timezone, callback) {
      var filterParams = {};
      filterParams.fromDate = moment(start).format('YYYY-MM-DD');
      filterParams.toDate = moment(end).format('YYYY-MM-DD');

      service.getFilteredEvents(filterParams)
        .then(function (response) {
          var newEvents = [];

          for (var i = 0; i < service.events.length; i++) {
            var newEvent = {};
            newEvent.title = service.events[i].name;
            newEvent.start = service.events[i].create_date;
            newEvent.end = service.events[i].end_date;
            newEvents.push(newEvent);
          }

          callback(newEvents);
        }, function (response) {
          $log.warn('EventFactory.fullCalendarGetEvents: Failed to get events');
        });
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
          return response.data;
        }, function (response) {
          $log.warn('Failed to retrieve filtered events: ' + filterParams);
          $log.warn('Response: ' + response);
          return $q.reject(response);
        });
    }
  }
})();
