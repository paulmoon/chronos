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
   		eventId: "1",
   		title: "Title Test",
   		description: "A very basic description of an event",
   		creator: "Carljr.",
   		creationDate: "01/24/1992",
   		editDate: "None",
   		location: "Victoria, BC",
   		startDate: "01/24/1992",
   		endDate: "01/24/2020",
   		vote: "10",
   		tags: "???",
   	},
   	{
   		eventId: "2",
   		title: "Some Place",
   		description: "Another description of an event",
   		creator: "Carlossenior",
   		creationDate: "01/24/1992",
   		editDate: "None",
   		location: "Victoria, BC",
   		startDate: "01/24/1992",
   		endDate: "01/24/2020",
   		vote: "12",
   		tags: "Music",
   	},];
  });
