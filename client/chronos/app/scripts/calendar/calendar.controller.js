(function () {
  angular
    .module('chronosApp')
    .controller('RightPanelController', RightPanelController);

  RightPanelController.$inject = ['$scope', 'RestService'];

  function RightPanelController($scope, RestService) {
    /* jshint validthis: true */
    var vm = this;

    vm.title = 'RightPanelController';
    vm.generateEvents = generateEvents;

    // Need to use scope.eventSources instead of vm.eventSources because of
    $scope.eventSources = {};

    activate();

    ////////////////

    function activate() {
      $scope.uiConfig = {
        calendar: {
          height: 2400,
          editable: false,
          dayClick: $scope.dayClick,
          eventResize: $scope.eventResize
        }
      };

      $scope.eventSources = {
        events: generateEvents,
        color: 'yellow',   // an option!
        textColor: 'black' // an option!
      };
    }


    function generateEvents(start, end, timezone, callback) {
      console.log('Generate Events');




    }

  }

})();
