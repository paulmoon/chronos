
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

    /**
     * @desc Controller for the event card directives
     */
  	function EventCardController($scope, RestService, AuthService) {
  		var vm = this;

  		vm.voteEvent = voteEvent;
  		vm.upvoteEvent = upvoteEvent;
  		vm.downvoteEvent = downvoteEvent;

      /**
       * @description Adds a vote for an event in the direction specified, and associates it with
       *  the current user
       * @memberOf chronosApp:EventCardController
       * @param direction: An integer representing the direction of the vote. Either 1, 0, or -1
       * @param callback: A function to be executed on the successful voting of an event
      */
  		function voteEvent(direction, callback) {
  			RestService.voteEvent(vm.eventId, direction)
  			.then( function(data) {
  				callback();
  			} , 
  			function(response) {
  				console.log("Failed");
  			})
  		}

      /**
       * @description Upvotes the event
       * @memberOf chronosApp:EventCardController
       */
  		function upvoteEvent() {
  			vm.voteEvent(1, function() {
  				vm.upArrowStyle = {
  				color: 'orange'
  				};
  				vm.downArrowStyle = {};
  			});
  		}

      /**
       * @description Downvotes the event
       * @memberOf chronosApp:EventCardController
       */
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