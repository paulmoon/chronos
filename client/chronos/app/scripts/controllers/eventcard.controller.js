
/**
 * @ngdoc function
 * @name chronosApp.controller:EventcardcontrollerCtrl
 * @description
 * # EventcardcontrollerCtrl
 * Controller of the chronosApp
 */

(function(){
'use strict';

angular
	.module('chronosApp')
  	.controller('EventCardController', EventCardController);

  	EventCardController.$inject = ['$scope', 'RestService', 'AuthService'];

  	function EventCardController($scope, RestService, AuthService) {
  		var vm = this;

  		vm.voteEvent = voteEvent;
  		vm.upvoteEvent = upvoteEvent;
  		vm.downvoteEvent = downvoteEvent;

  		function voteEvent(direction, callback) {
  			console.log(RestService)
  			RestService.voteEvent(vm.eventId, direction)
  			.then( function(data) {
  				callback();
  			} , 
  			function(response) {
  				console.log("Failed");
  			})
  		}

  		function upvoteEvent() {
  			vm.voteEvent(1, function() {
  				vm.upArrowStyle = {
  				color: 'orange'
  				};
  				vm.downArrowStyle = {};
  			});
  		}

  		function downvoteEvent() {
  			vm.voteEvent(-1, function() {
  				vm.downArrowStyle = {
  				color: 'orange'
  				};
  				vm.upArrowStyle = {};
  			});
  		}

  	};

})();