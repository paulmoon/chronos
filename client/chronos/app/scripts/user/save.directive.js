/**
 * @author Danny Guan
 * @ngdoc directive
 * @name chronosApp.directive:report
 * @description
 * # save
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('save', save);

  function save() {
    var directive = {
      templateUrl: 'scripts/user/save.html',
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
