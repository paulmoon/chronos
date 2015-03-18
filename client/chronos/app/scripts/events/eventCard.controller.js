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

  EventCardController.$inject = ['$scope', 'RestService', 'AuthService', 'EventFactory'];

  /**
   * @desc Controller for the event card directives
   */
  function EventCardController($scope, RestService, AuthService, EventFactory) {
    var vm = this;

    vm.voteEvent = voteEvent;
    vm.upvoteEvent = upvoteEvent;
    vm.downvoteEvent = downvoteEvent;

    vm.reportEvent = reportEvent;
    vm.followEvent = followEvent;
    vm.goUser = goUser;
    vm.isLoggedIn = AuthService.isLoggedIn;
    vm.addTag = addTag;

    vm.displayStartDate = _displayDate(vm.startDate);
    vm.displayEndDate = _displayDate(vm.endDate);

    if (vm.eventName.length > 70){
      vm.displayName = vm.eventName.substring(0, 70) + "...";
    } else {
      vm.displayName = vm.eventName;
    }

    function _displayDate(date) {
      return date.local().format('ddd, MMMM Do [at] h:mma');
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
        vm.vote++;
      });
    }

    /**
     * @description Downvotes the event
     * @memberOf chronosApp:EventCardController
     */
    function downvoteEvent() {
      vm.voteEvent(-1, function () {
        vm.downArrowStyle = {
          color: 'crimson'
        };
        vm.upArrowStyle = {};
        vm.vote--;
      });
    }

    /**
     * @description Reports the event
     * @memberOf chronosApp:EventCardController
     * @param reason: a string containing the reason the event was reported
     */
    function reportEvent(reason) {
      RestService.reportEvent(vm.eventId, reason)
        .success(function () {
          vm.reportButtonStyle = {
            color: 'crimson'
          };
        })
        .error(function () {
          //TODO: Add something here
        });
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
      });
    }

    /**
     * @description Handles when a user clicks a username
     * @memberOf chronosApp:EventCardController
     */
    function goUser() {
      // Future Functionality
    }

    /**
     * @description Updates the tags and updates the events
     * @methodOf chronosApp:EventCardFunctionality
     * @param addedTag: a string containing the tag to be added
     */
    function addTag(addedTag) {
      EventFactory.addTag(addedTag);
    }
  }
})();
