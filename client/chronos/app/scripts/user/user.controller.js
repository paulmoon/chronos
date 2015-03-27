/**
 * @author Danny Guan
 * @ngdoc function
 * @name chronosApp:VotingController
 * @description ViewModel for voting
 */
(function () {
  'use strict';

  angular
    .module('chronosApp')
    .controller('UserController', UserController);

  UserController.$inject = ['AuthFacadeService', 'EventFacadeService', '$modal'];

  /**
   * @desc Controller for the voting directives
   */
  function UserController(AuthFacadeService, EventFacadeService, $modal) {
    var vm = this;

    vm.saveEvent = 'UNSAVED';

    vm.voteEvent = EventFacadeService.voteEvent;
    vm.upvoteEvent = upvoteEvent;
    vm.downvoteEvent = downvoteEvent;
    vm.openLoginModal = openLoginModal;
    vm.saveEventClick = saveEventClick;
    vm.reportEvent = reportEvent;
    vm.isLoggedIn = AuthFacadeService.isLoggedIn;

    _activate();
    /////////////////////////////////

    function _activate() {
      // vm.voteDirectionByUser and vm.eventSaved will be strings because they were interpolated using @.
      if(vm.isLoggedIn()) {
        AuthFacadeService.retrieveUserProfile()
          .then(function (response) {
            var votedEvents = response.data.voted_events;
            var savedEvents = response.data.saved_events;
            var reportedEvents = response.data.reported_events;

            for(var i = 0, len = votedEvents.length; i < len; ++i) {
              if (vm.eventId == votedEvents[i].event.id) {
                vm.voteDirectionByUser = votedEvents[i].direction;
                break;
              }
            }

            for(var i = 0, len = savedEvents.length; i < len; ++i) {
              if (vm.eventId == savedEvents[i].id) {
                vm.saveEvent = 'SAVED';
                vm.saveButtonStyle = {
                  color: 'orange'
                };
                break;
              }
            }

            for(var i = 0, len = reportedEvents.length; i < len; ++i) {
              if(vm.eventId == reportedEvents[i].event) {
                vm.reportButtonStyle = {
                  color: 'crimson'
                };
                break;
              }
            }

            if (vm.voteDirectionByUser == "1") {
              vm.upArrowStyle = {color: "orange"};
              vm.downArrowStyle = {};
            } else if (vm.voteDirectionByUser == "-1") {
              vm.upArrowStyle = {};
              vm.downArrowStyle = {color: "blue"};
            }
          });
      }
    }

    /**
     * @description Upvotes the event
     * @memberOf chronosApp:VoteController
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
     * @memberOf chronosApp:VoteController
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
     * @description Modifies the saved event button
     * @methodOf chronosApp:VotingController
     */
    function saveEventClick() {
      if(vm.saveEvent == 'SAVED') {
        unsaveEvent();
        vm.saveEvent = 'UNSAVED';
      } else {
        saveEvent();
        vm.saveEvent = 'SAVED';
      }
    }

    /**
     * @description Unsaves the event to the user
     * @memberOf chronosApp:VotingController
     */
    function unsaveEvent() {
      EventFacadeService.unsaveEvent(vm.eventId);
      vm.saveButtonStyle = {};
    }

    /**
     * @description Saves the event to the user
     * @memberOf chronosApp:VotingController
     */
    function saveEvent() {
      EventFacadeService.saveEvent(vm.eventId);
      vm.saveButtonStyle = {
        color: 'orange'
      };
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
     * @description This function opens the modal for Login
     * @methodOf chronosApp:VotingController
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
