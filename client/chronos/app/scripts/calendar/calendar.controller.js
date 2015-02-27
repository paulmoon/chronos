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
    vm.eventSources = [EventFactory.fullCalendarGetEvents];

    activate();

    ////////////////

    function activate() {
      // Need to use scope instead of vm because of ui.calendar

      $scope.uiConfig = {
        calendar: {
          header: {
            left: 'month basicWeek',
            center: 'title'
          },
          editable: false,
          eventLimit: settings.eventLimit,
          dayClick: dayClick,
          eventResize: vm.eventResize
        }
      };
    }

    function dayClick(date, jsEvent, view) {
      console.log("day clicked! " + date + ' ' + jsEvent + ' ' + view);
    }

    function generateEvents(start, end, timezone, callback) {
      console.log('Generate Events');
    }
  }
})();
