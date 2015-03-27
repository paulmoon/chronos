/**
 * @author Danny Guan
 * @ngdoc directive
 * @name chronosApp.directive:report
 * @description
 * # report
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('report', report);

  function report() {
    var directive = {
      templateUrl: 'scripts/user/report.html',
      restrict: 'E',
      scope: {
        eventId: '='
      },
      controller: 'UserController',
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;
  }
})();
