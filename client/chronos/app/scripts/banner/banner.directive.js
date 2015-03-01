/**
 * @ngdoc directive
 * @name chronosApp.directive:banner
 * @description
 * # banner
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .directive('banner', function () {
      return {
        templateUrl: 'scripts/banner/banner.html',
        restrict: 'E'
      };
    });
})();
