/**
 * @author Justin Guze
 * @ngdoc function
 * @name chronosApp:BannerController
 * @description
 * BannerController
 */

(function () {
  'use strict';

  angular
    .module('chronosApp')
    .controller('BannerController', BannerController);

  BannerController.$inject = ['$modal', 'AuthFacadeService', 'EventFacadeService', 'UserFacadeService', 'StateService', 'PubSubService', 'settings'];

  function BannerController($modal, AuthFacadeService, EventFacadeService, UserFacadeService, StateService, PubSubService, settings) {
    var vm = this;

    vm.title = 'BannerController';
    vm.chosenPlace = '';
    vm.filters = ['(cities)'];
    vm.isLoggedIn = AuthFacadeService.isLoggedIn;
    vm.logout = AuthFacadeService.logout;
    vm.refreshEvents = EventFacadeService.refreshEvents;

    vm.onLogin = onLogin;
    vm.openSignupModal = openSignupModal;
    vm.openLoginModal = openLoginModal;
    vm.changeLocation = changeLocation;
    vm.saveUserLocation = saveUserLocation;
    vm.openCreateEventModal = openCreateEventModal;

    _activate();

    ////////////////////////////

    function _activate() {
      if (AuthFacadeService.isLoggedIn()) {
        vm.chosenPlace = StateService.getPlaceName();
      }

      PubSubService.subscribe(settings.pubSubOnLogin, onLogin);
    }

    function onLogin() {
      if (StateService.getPlaceName() !== null) {
        vm.chosenPlace = StateService.getPlaceName();
      }
      vm.refreshEvents();
    }

    function openSignupModal() {
      var modalInstance = $modal.open({
        templateUrl: 'scripts/auth/authModal.html',
        controller: 'AuthModalController as authModal',
        resolve: {
          shouldShowSignUpModal: function () {
            return true;
          }
        }
      });
    }

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

    function openCreateEventModal() {
      var modalInstance = $modal.open({
        templateUrl: 'scripts/events/eventModal.html',
        controller: 'EventModalController as eventModal',
        windowClass: 'create-modal-size',
        resolve: {
          shouldShowEventCreateModal: function () {
            return true;
          }
        }
      });

      modalInstance.result.then(vm.refreshEvents);
    }

    /**
     * @description Function called when a user selects a place via the Google autocomplete box.
     * @methodOf chronosApp:BannerController
     * @param chosenPlaceDetails Google Place object
     */
    function changeLocation(chosenPlaceDetails) {
      if (chosenPlaceDetails.name === '') {
        StateService.setPlaceID(null);
        StateService.setPlaceName(null);
      } else {
        StateService.setPlaceID(chosenPlaceDetails.place_id);
        StateService.setPlaceName(chosenPlaceDetails.formatted_address);
      }

      vm.refreshEvents();

      if (vm.isLoggedIn()) {
        vm.saveUserLocation();
      }
    }

    function saveUserLocation() {
      var _chosenPlaceID = StateService.getPlaceID();
      var _chosenPlaceName = StateService.getPlaceName();

      UserFacadeService.updateUserLocation(_chosenPlaceID, _chosenPlaceName).
        success(function (data, status, headers, config) {
          // Fill in at later date
        }).
        error(function (data, status, headers, config) {
          // Fill in at later date
        });
    }
  }
})();
