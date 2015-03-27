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
    .controller('VotingController', VotingController);

  VotingController.$inject = ['AuthFacadeService', 'EventFacadeService', '$modal'];

  /**
   * @desc Controller for the voting directives
   */
  function VotingController(AuthFacadeService, EventFacadeService, $modal) {
    var vm = this;

    vm.voteEvent = EventFacadeService.voteEvent;
    vm.upvoteEvent = upvoteEvent;
    vm.downvoteEvent = downvoteEvent;
    vm.openLoginModal = openLoginModal;
    vm.isLoggedIn = AuthFacadeService.isLoggedIn;

    _activate();

    /////////////////////////////////

    function _activate() {
      // vm.voteDirectionByUser and vm.eventSaved will be strings because they were interpolated using @.
      if(vm.isLoggedIn()) {
        AuthFacadeService.retrieveUserProfile()
          .then(function (response) {
            var votedEvents = response.data.voted_events;
            for (var i = 0, len = votedEvents.length; i < len; ++i) {
              if (vm.eventId == votedEvents[i].event.id) {
                vm.voteDirectionByUser = votedEvents[i].direction;
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
