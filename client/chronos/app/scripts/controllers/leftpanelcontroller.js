'use strict';

/**
 * @ngdoc function
 * @name chronosApp.controller:LeftPanelController
 * @description
 * # LeftPanelController
 * Controller of the chronosApp
 */
angular.module('chronosApp')
  .controller('LeftPanelController', function ($scope, StateService, RestService) {
   	$scope.events = [{
   		eventTitle: "Title Test",
   		test: "TESTING"
   	},
   	{
   		eventTitle: "Second event",
   		test: "New Test",
   	},];
  });
