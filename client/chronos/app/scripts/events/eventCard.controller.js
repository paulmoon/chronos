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

  EventCardController.$inject = ['$timeout', 'AuthFacadeService', 'EventFacadeService', 'PubSubService', 'settings', '$modal'];

  /**
   * @desc Controller for the event card directives
   */
  function EventCardController($timeout, AuthFacadeService, EventFacadeService, PubSubService, settings, $modal) {
    var vm = this;

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
    vm.openLoginModal = openLoginModal;

    vm.displayStartDate = _displayDate(vm.startDate);
    vm.displayEndDate = _displayDate(vm.endDate);

    vm.isBlinking = false;

    vm.onEventCalendarClick = onEventCalendarClick;
    vm.onMouseEnter = onMouseEnter;
    vm.onMouseLeave = onMouseLeave;

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

      // Used for when an event is clicked from the calendar
      PubSubService.subscribe(settings.pubSubOnEventCalendarClick + vm.eventId.toString(), vm.onEventCalendarClick);
    }

    function onMouseEnter() {
      var elements = document.getElementsByClassName("event-calendar-" + vm.eventId);
      for(var i = 0; i < elements.length; i++) {
        angular.element(elements[i]).addClass("calendar-event-highlight");
      }
    }

    function onMouseLeave() {
      var elements = document.getElementsByClassName("event-calendar-" + vm.eventId);
      for(var i = 0; i < elements.length; i++) {
        angular.element(elements[i]).removeClass("calendar-event-highlight");
      }
    }

    function onEventCalendarClick() {
      vm.isBlinking = true;
      $timeout(function() {
        vm.isBlinking = false;
      }, 1000);
    }

    /**
     * @description Upvotes the event
     * @memberOf chronosApp:EventCardController
     */
    function upvoteEvent() {
      if (vm.voteDirectionByUser === -1){
        vm.voteEvent(vm.eventId, 1);
        vm.upArrowStyle = {
          color: 'orange'
        };
        vm.downArrowStyle = {};
        vm.vote = vm.vote + 2;
        vm.voteDirectionByUser = 1;
      } else if (vm.voteDirectionByUser === 1){
        vm.voteEvent(vm.eventId, 0);
        vm.upArrowStyle = {};
        vm.downArrowStyle = {};
        vm.vote = vm.vote -1;
        vm.voteDirectionByUser = 0;
      } else {
        vm.voteEvent(vm.eventId, 1);
        vm.upArrowStyle = {
          color: 'orange'
        };
        vm.downArrowStyle = {};
        vm.vote = vm.vote + 1;
        vm.voteDirectionByUser = 1;
      }
    }

    /**
     * @description Downvotes the event
     * @memberOf chronosApp:EventCardController
     */
    function downvoteEvent() {
      if (vm.voteDirectionByUser === 1){
        vm.voteEvent(vm.eventId, -1);
        vm.downArrowStyle = {
          color: 'blue'
        };
        vm.upArrowStyle = {};
        vm.vote = vm.vote - 2;
        vm.voteDirectionByUser = -1;
      } else if (vm.voteDirectionByUser === -1){
        vm.voteEvent(vm.eventId, 0);
        vm.downArrowStyle = {};
        vm.upArrowStyle = {};
        vm.vote = vm.vote + 1;
        vm.voteDirectionByUser = 0;
      } else {
        vm.voteEvent(vm.eventId, -1);
        vm.downArrowStyle = {
          color: 'blue'
        };
        vm.upArrowStyle = {};
        vm.vote = vm.vote - 1;
        vm.voteDirectionByUser = -1;
      }
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
      vm.eventReported = "true";
    }

    /**
     * @description Action taken when save button is clicked
     * @memberOf chronosApp:EventCardController
     */
    function saveClicked() {
      if (vm.eventSaved == "false") {
        vm.saveEvent();
        vm.eventSaved = "true";
      } else {
        vm.unsaveEvent();
        vm.eventSaved = "false";
      }
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
      vm.onMouseLeave();
    }

    /**
     * @description This function opens the modal for Login
     * @methodOf chronosApp:EventCardController
     */
    function openLoginModal() {
      var modalInstance = $modal.open({
        templateUrl: 'scripts/auth/authModal.html',
        controller: 'AuthModalController as authModal',
        resolve: {
          shouldShowSignUpModal: function () {
            return false;
          }
        }
      });
    }
  }
})();
