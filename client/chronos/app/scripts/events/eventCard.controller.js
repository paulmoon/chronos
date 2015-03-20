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

    vm.saved = false;

    vm.voteEvent = voteEvent;
    vm.upvoteEvent = upvoteEvent;
    vm.downvoteEvent = downvoteEvent;

    vm.reportEvent = reportEvent;
    vm.saveClicked = saveClicked;
    vm.saveEvent = saveEvent;
    vm.unsaveEvent = unsaveEvent;
    vm.goUser = goUser;
    vm.isLoggedIn = AuthService.isLoggedIn;
    vm.addTag = addTag;

    vm.displayStartDate = _displayDate(vm.startDate);
    vm.displayEndDate = _displayDate(vm.endDate);

    function _activate() {
      if (vm.eventName.length > 70){
        vm.displayName = vm.eventName.substring(0, 70) + "...";
      } else {
        vm.displayName = vm.eventName;
      }

      if (vm.saved) {
        vm.saveButtonStyle = {
            color: 'orange'
        };
      }
    }

    function _displayDate(date) {
      return date.local().format('ddd, MMMM Do [at] h:mma');
    }

    /**
     * @description Adds a vote for an event in the direction specified, and associates it with
     *  the current user
     * @memberOf chronosApp:EventCardController
     * @param direction: An integer representing the direction of the vote. Either 1, 0, or -1
     */
    function voteEvent(direction, callback) {
      RestService.voteEvent(vm.eventId, direction)
        .then(function (data) { 

        },
        function (response) {
          //TODO: Add something here
        });
      callback();
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

        })
        .error(function () {
          //TODO: Add something here
        });
        vm.reportButtonStyle = {
          color: 'crimson'
        };
    }

    /*
     * @description Action taken when save button is clicked
     * @memberOf chronosApp:EventCardController
     */
    function saveClicked() {
      if (!vm.saved) {
        vm.saveEvent();
      } else {
        vm.unsaveEvent();
      }
    }

    /**
     * @description Unsaves the event to the user
     * @memberOf chronosApp:EventCardController
     */
    function unsaveEvent() {
      RestService.unsaveEvent(vm.eventId)
      .success(function() {

      })
      .error(function() {

      });
      vm.saveButtonStyle = {};
      vm.saved = false;
    }

    /**
     * @description Saves the event to the user
     * @memberOf chronosApp:EventCardController
     */
    function saveEvent() {
      RestService.saveEvent(vm.eventId)
      .success(function() {
      })
      .error(function() {
      });
      vm.saveButtonStyle = {
        color: 'orange'
      };
      vm.saved = true;
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
