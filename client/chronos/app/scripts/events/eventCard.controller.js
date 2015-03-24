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

  EventCardController.$inject = ['AuthFacadeService', 'EventFacadeService'];

  /**
   * @desc Controller for the event card directives
   */
  function EventCardController(AuthFacadeService, EventFacadeService) {
    var vm = this;

    /**
     * @description Adds a vote for an event in the direction specified, and associates it with
     *  the current user
     * @memberOf chronosApp:EventCardController
     * @param direction: An integer representing the direction of the vote. Either 1, 0, or -1
     * @param callback: A function to be executed on the successful voting of an event
     */
    vm.voteEvent = EventFacadeService.voteEvent;
    vm.upvoteEvent = upvoteEvent;
    vm.downvoteEvent = downvoteEvent;

    vm.reportEvent = reportEvent;
    vm.saveClicked = saveClicked;
    vm.saveEvent = saveEvent;
    vm.unsaveEvent = unsaveEvent;
    vm.goToUser = goToUser;

    vm.isLoggedIn = AuthFacadeService.isLoggedIn;
    vm.addTag = addTag;

    vm.displayStartDate = _displayDate(vm.startDate);
    vm.displayEndDate = _displayDate(vm.endDate);

    _activate();

    /////////////////////////////////

    function _activate() {
      if (vm.eventName.length > 70) {
        vm.displayName = vm.eventName.substring(0, 70) + "...";
      } else {
        vm.displayName = vm.eventName;
      }

      // vm.voteDirectionByUser and vm.eventSaved will be strings because they were interpolated using @.
      if (vm.voteDirectionByUser === "1") {
        vm.upArrowStyle = {color: "orange"};
        vm.downArrowStyle = {};
      } else if (vm.voteDirectionByUser === "-1") {
        vm.upArrowStyle = {};
        vm.downArrowStyle = {color: "blue"};
      }

      if (vm.eventSaved === "true") {
        vm.saveButtonStyle = {color: "orange"};
      }

      if (vm.eventReported === "true") {
        vm.reportButtonStyle = {color: "crimson"};
      }
    }

    /**
     * @description Upvotes the event
     * @memberOf chronosApp:EventCardController
     */
    function upvoteEvent() {
      vm.voteEvent(vm.eventId, 1);
      vm.upArrowStyle = {
        color: 'orange'
      };
      vm.downArrowStyle = {};
    }

    /**
     * @description Downvotes the event
     * @memberOf chronosApp:EventCardController
     */
    function downvoteEvent() {
      vm.voteEvent(vm.eventId, -1);
      vm.downArrowStyle = {
        color: 'blue'
      };
      vm.upArrowStyle = {};
    }

    /**
     * @description Reports the event
     * @memberOf chronosApp:EventCardController
     * @param reason: a string containing the reason the event was reported
     */
    function reportEvent(reason) {
      EventFacadeService.reportEvent(vm.eventId, reason);
      vm.reportButtonStyle = {
        color: 'crimson'
      };
    }

    /**
     * @description Action taken when save button is clicked
     * @memberOf chronosApp:EventCardController
     */
    function saveClicked() {
      if (!vm.eventSaved) {
        vm.saveEvent();
      } else {
        vm.unsaveEvent();
      }
      vm.eventSaved = !vm.eventSaved;
    }

    /**
     * @description Unsaves the event to the user
     * @memberOf chronosApp:EventCardController
     */
    function unsaveEvent() {
      EventFacadeService.unsaveEvent(vm.eventId);
      vm.saveButtonStyle = {};
    }

    /**
     * @description Saves the event to the user
     * @memberOf chronosApp:EventCardController
     */
    function saveEvent() {
      EventFacadeService.saveEvent(vm.eventId);
      vm.saveButtonStyle = {
        color: 'orange'
      };
    }

    /**
     * @description Handles when a user clicks a username
     * @memberOf chronosApp:EventCardController
     */
    function goToUser() {
      // Future Functionality
    }

    function _displayDate(date) {
      return date.local().format('ddd, MMMM Do [at] h:mma');
    }

    /**
     * @description Updates the tags and updates the events
     * @methodOf chronosApp:EventCardFunctionality
     * @param addedTag: a string containing the tag to be added
     */
    function addTag(addedTag) {
      EventFacadeService.addTag(addedTag);
    }
  }
})();
