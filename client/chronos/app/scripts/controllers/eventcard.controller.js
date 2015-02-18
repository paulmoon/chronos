'use strict';

/**
 * @ngdoc function
 * @name chronosApp.controller:EventcardcontrollerCtrl
 * @description
 * # EventcardcontrollerCtrl
 * Controller of the chronosApp
 */

(function(){
angular
	.module('chronosApp')
  	.controller('EventCardController', EventCardController);

  	EventCardController.inject = ['$scope', 'RestService', 'AuthService'];

  	function EventCardController($scope, RestService, AuthService) {
  		var vm = this;

  		function vote(direction) {
  			RestService.voteEvent(vm.eventId, direction)
  			.then( function(data) {
  				// Do vote stuff
  				console.log(data);
  			} , 
  			function(response) {
  				console.log("Failed");
  				console.log(response);
  			})
  		}

  		function upvoteEvent() {
  			vm.vote(1);
  		}

  		function downvoteEvent() {
  			vm.vote(-1);
  		}
  	};

})();