'use strict';

/**
 * @ngdoc directive
 * @name chronosApp.directive:banner
 * @description
 * # banner
 */
angular.module('chronosApp')
  .directive('banner', function () {
    return {
      templateUrl: 'scripts/directives/banner.html',
      restrict: 'E',
      
    };
  });
