/**
 * @author Danny Guan
 * @ngdoc directive
 * @name chronosApp.directive:voting
 * @description
 * # eventCard
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('voting', voting);

  function voting() {
    var directive = {
      templateUrl: 'scripts/voting/voting.html',
      restrict: 'E',
      scope: {
        vote: '=',
        eventId: '='
      },
      controller: 'VotingController',
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;
  }
})();
