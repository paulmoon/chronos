/**
 * @author Danny Guan
 * @ngdoc directive
 * @name chronosApp.directive:voting
 * @description
 * # voting
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('voting', voting);

  function voting() {
    var directive = {
      templateUrl: 'scripts/user/voting.html',
      restrict: 'E',
      scope: {
        vote: '=',
        eventId: '='
      },
      controller: 'UserController',
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;
  }
})();
