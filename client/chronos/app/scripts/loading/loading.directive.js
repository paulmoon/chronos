/**
 * @author Mark Roller 
 * @ngdoc directive
 * @name chronosApp.directive:loading
 * @description directive for loading animations
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('loading', loading);

  function loading() {
    var directive = {
      templateUrl: 'scripts/loading/loading.html',
      restrict: 'E',
      scope: {
        eventCardLoader: '@',
        eventModalLoader: '@',
        authModalLoader: '@',
      },
      controller: 'LoadingController',
      controllerAs: 'vm',
      bindToController: true
    };
    return directive
  };

})();
