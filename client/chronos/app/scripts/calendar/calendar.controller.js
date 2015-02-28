/**
 * @author Paul Moon
 * @ngdoc service
 * @name chronosApp.CalendarController
 * @description Factory used for retrieving (filtered) events from a single place.
 */

(function () {
  angular
    .module('chronosApp')
    .controller('CalendarController', CalendarController);

  CalendarController.$inject = ['$scope', 'settings', 'EventFactory'];

  function CalendarController($scope, settings, EventFactory) {
    /* jshint validthis: true */
    var vm = this;

    vm.title = 'CalendarController';
    // Provide a function that FullCalendar will call as necessary to retrieve events
    vm.eventSources = [getEvents];

    activate();

    ////////////////

    function activate() {
      // Need to use scope instead of vm because of ui.calendar
      $scope.uiConfig = {
        calendar: {
          //height: ,
          header: {
            left: 'month basicWeek',
            center: 'title'
          },
          editable: false,
          selectable: true,
          eventLimit: settings.calendarEventLimitPerDay,
          dayClick: dayClick,
          eventClick: eventClick,
          select: select,
          unselect: unselect
        }
      };
    }

    /**
     * @description Function signature provided by FullCalendar for retrieving a list of events for a given time range.
     *  Will be called by FullCalendar when the calendar changes its date range.
     * @methodOf chronosApp:CalendarController
     * @param start Start time of the range in which events are to be shown. Date type.
     * @param end End time of the range in which events are to be shown. Date type.
     * @param callback Function to be called after events are retrieved.
     */
    function getEvents(start, end, timezone, callback) {
      console.log('Get Events');
      var filterParams = {};
      filterParams.fromDate = moment(start).format('YYYY-MM-DD');
      filterParams.toDate = moment(end).format('YYYY-MM-DD');

      EventFactory.getFilteredEvents(filterParams)
        .then(function (response) {
          console.log(response);
          callback(transformEventData(response));
        }, function (response) {
          $log.warn('EventFactory.getEvents: Failed to get events');
        });
    }

    function transformEventData(events) {
      var new_events = [];
      angular.forEach(events, function (event) {
        new_events.push({
          id: event.id,
          title: event.name,
          start: event.start_date,
          end: event.end_date
        });
      });
      console.log('new events');
      console.log(new_events);
      return new_events;
    }

    function dayClick(date, jsEvent, view) {
      // Future implementation for day click event.
    }

    function eventClick(event, jsEvent, view) {
      // Future implementation for day click event. Scroll to event in the left panel.
    }

    /**
     * Function that is called when user clicks or drags on the calendar.
     * @param start Epoch time format
     * @param end Epoch time format
     * @param jsEvent Primitive JS event
     * @param view
     */
    function select(start, end, jsEvent, view) {
      EventFactory.setHighlightRange(start, end);
    }

    function unselect(view, jsEvent) {
      // view !== undefined if user clicks outside of calendar. Clear highlighted events.
      if (view !== undefined) {
        EventFactory.highlightedEvents = EventFactory.getEvents();
      }
    }
  }
})();
