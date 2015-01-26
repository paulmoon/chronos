'use strict';

/**
 * @ngdoc directive
 * @name chronosApp.directive:eventCard
 * @description
 * # eventCard
 */
angular.module('chronosApp')
  .directive('eventcard', function (StateService, RestService) {
    return {
      templateUrl: 'scripts/directives/eventcard.html',
      restrict: 'E',
      scope: {
      	eventTitle:'=',
      	eventTest:'=',
      },
      controller: ['$scope', function($scope) {

      }],
    };
  });
