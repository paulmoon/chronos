/**
 * @author Paul Moon
 * @ngdoc service
 * @name chronosApp.CalendarController
 * @description Factory used for retrieving and updating events within a central place.
 */

(function () {
  angular
    .module('chronosApp')
    .controller('CalendarController', CalendarController);

  CalendarController.$inject = ['$scope', '$log', 'settings', 'EventFactory'];

  function CalendarController($scope, $log, settings, EventFactory) {
    /* jshint validthis: true */
    var vm = this;

    vm.title = 'CalendarController';
    // A function that FullCalendar will call as necessary to retrieve events
    vm.eventSources = [getEvents];

    activate();

    ////////////////

    function activate() {
      // Need to use $scope instead of vm because of ui.calendar (Angular directive for FullCalendar)
      $scope.uiConfig = {
        calendar: {
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
     *  Called by FullCalendar when the calendar changes its date range.
     * @methodOf chronosApp:CalendarController
     * @param start Start time of the range in which events are to be shown. Moment type.
     * @param end End time of the range in which events are to be shown. Moment type.
     * @param callback Function to be called after events are retrieved.
     */
    function getEvents(start, end, timezone, callback) {
      EventFactory.updateDateRange(start, end)
        .then(function (response) {
          callback(transformEventData(response));
        }, function (response) {
          $log.warn('EventFactory.getEvents: Failed to get events');
          $log.warn('Response: ' + response);
        });
    }

    /**
     * Transforms the list of events obtained from the server to a FullCalendar event format.
     * @methodOf chronosApp:CalendarController
     * @param events List of events from the server
     * @returns {Array} Events transformed for use by FullCalendar
     */
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
      return new_events;
    }

    /**
     * Function called when a user clicked on a day.
     * @methodOf chronosApp:CalendarController
     * @param date Selected date. Moment type.
     * @param jsEvent Primitive JS event
     * @param view
     */
    function dayClick(date, jsEvent, view) {
      // Future implementation for day click event.
    }

    /**
     * Function called when a user click on an event.
     * @methodOf chronosApp:CalendarController
     * @param event FullCalendar event type
     * @param jsEvent Primitive JS event
     * @param view
     */
    function eventClick(event, jsEvent, view) {
      // Future implementation for day click event. Scroll to event in the left panel.
    }

    /**
     * Function called when user clicks or drags on the calendar.
     * @methodOf chronosApp:CalendarController
     * @param start Moment type
     * @param end Moment type
     * @param jsEvent Primitive JS event
     * @param view
     */
    function select(start, end, jsEvent, view) {
      EventFactory.updateSelectionRange(start, end);
    }

    /**
     * FullCalendar function called when either the user select away from the current selection, or makes a new date selection.
     * @methodOf chronosApp:CalendarController
     * @param view Primitive JS event
     * @param jsEvent
     */
    function unselect(view, jsEvent) {
      // view !== undefined if user clicks outside of calendar. Clear highlighted events.
      if (view !== undefined) {
        EventFactory.selectedEvents = EventFactory.getEvents();
      }
    }
  }
})();
