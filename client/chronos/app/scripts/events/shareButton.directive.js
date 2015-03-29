/**
 * @author Danny Guan
 * @ngdoc directive
 * @name chronosApp.directive:shareButton
 * @description
 * # shareButton
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('shareButton', shareButton);

  function shareButton() {
    var directive = {
      templateUrl: 'scripts/events/shareButton.html',
      restrict: 'E',
      scope: {
        share: '=url'
      }
    };
    return directive;
  }
})();
