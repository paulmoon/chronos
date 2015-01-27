'use strict';

/**
 * @author Justin Guze
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
   		test: "TESTING",
   		eventId: "1",
   	},
   	{
   		eventTitle: "Second event",
   		test: "New Test",
   		eventId: "2",
   	},];
  });
