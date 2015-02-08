'use strict';

/**
 * @author Justin Guze
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
      	title:'=',
      	description:'=',
      	eventId:'=',
      	creator:'=',
      	creationDate:'=',
      	location:'=',
      	startDate:'=',
      	endDate:'=',
      	vote:'=',
        report:'=',
      },
      controller: ['$scope', function($scope) {
      }],
    };
  });