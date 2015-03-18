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
    vm.followEvent = followEvent;
    vm.goUser = goUser;
    vm.isLoggedIn = AuthFacadeService.isLoggedIn;

    vm.displayStartDate = _displayDate(vm.startDate);
    vm.displayEndDate = _displayDate(vm.endDate);

    if (vm.eventName.length > 70) {
      vm.displayName = vm.eventName.substring(0, 70) + "...";
    } else {
      vm.displayName = vm.eventName;
    }

    function _displayDate(date) {
      return date.local().format('ddd, MMMM Do [at] h:mma');
    }

    /**
     * @description Upvotes the event
     * @memberOf chronosApp:EventCardController
     */
    function upvoteEvent() {
      vm.voteEvent(vm.eventId, 1)
        .then(function () {
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
      vm.voteEvent(vm.eventId, -1)
        .then(function () {
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
      EventFacadeService.saveEvent(vm.eventId)
        .success(function () {
          vm.saveButtonStyle = {
            color: 'orange'
          };
        })
        .error(function () {
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
