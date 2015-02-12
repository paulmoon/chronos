angular
  .module('chronosApp')
  .controller('RightPanelController', RightPanelController);

RightPanelController.$inject = ['$scope'];

function RightPanelController($scope) {
  /* jshint validthis: true */
  var vm = this;

  vm.activate = activate;
  vm.title = 'RightPanelController';
  $scope.eventSources = [];

  activate();

  ////////////////

  function activate() {
    $scope.uiConfig = {
      calendar: {
        height: 2400
      }
    };

  }

}
