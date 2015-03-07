/**
 * @ngdoc function
 * @name chronosApp.controller:EventcardcontrollerCtrl
 * @description
 * # EventcardcontrollerCtrl
 * Controller of the chronosApp
 */

(function () {
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

    vm.reportEvent = reportEvent;
    vm.followEvent = followEvent;
    vm.goUser = goUser;
    vm.isLoggedIn = AuthService.isLoggedIn;

    vm.displayStartDate = vm.startDate._i.replace("T"," @ ");
    vm.displayEndDate = vm.endDate._i.replace("T"," @ ");
    vm.displayStartDate = vm.displayStartDate.substring(0, vm.displayEndDate.length - 4);
    vm.displayEndDate = vm.displayEndDate.substring(0, vm.displayEndDate.length - 4);

    if (vm.eventName.length > 70){
      vm.displayName = vm.eventName.substring(0, 70) + "...";
    } else {
      vm.displayName = vm.eventName;
    }

    /**
     * @description Adds a vote for an event in the direction specified, and associates it with
     *  the current user
     * @memberOf chronosApp:EventCardController
     * @param direction: An integer representing the direction of the vote. Either 1, 0, or -1
     * @param callback: A function to be executed on the successful voting of an event
     */
    function voteEvent(direction, callback) {
      RestService.voteEvent(vm.eventId, direction)
        .then(function (data) {
          callback();
        },
        function (response) {
          //TODO: Add something here
        })
    }

    /**
     * @description Upvotes the event
     * @memberOf chronosApp:EventCardController
     */
    function upvoteEvent() {
      vm.voteEvent(1, function () {
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
      vm.voteEvent(-1, function () {
        vm.downArrowStyle = {
          color: 'orange'
        };
        vm.upArrowStyle = {};
      });
    }

    /**
     * @description Reports the event
     * @memberOf chronosApp:EventCardController
     */
    function reportEvent() {
      // Future Functionality
    }

    /**
     * @description Saves the event to the user
     * @memberOf chronosApp:EventCardController
     */
    function followEvent() {
      RestService.saveEvent(vm.eventId)
      .success(function() {
        vm.saveButtonStyle = {
          color: 'orange'
        };
      })
      .error(function() {
        console.log("Error. Couldn't save");
      });
    }

    /**
     * @description Handles when a user clicks a username
     * @memberOf chronosApp:EventCardController
     */
    function goUser() {
      // Future Functionality
    }
  }
})();
